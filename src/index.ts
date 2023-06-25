import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ioServerOptions } from "./configs/options";
import { ServerClient } from "./models/ServerClient";
import RouteAuth from "./routes/auth.routes";
import RouteMessage from "./routes/messages.routes";
import RouteAll from "./routes/all.routes";
import { DTO_Players, getRandomPuzzle } from "./utils";
import { EVENTS, Diff, GameRow, transformData } from "./lib";
import { Subject } from "rxjs";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, ioServerOptions);

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", RouteAuth);
app.use("/api/messages", RouteMessage);
app.use("/api/all", RouteAll);

export const getTotalClosedCells = (data: GameRow[] = []) => {
  return data.reduce<number>((acc, row) => {
    let temp = 0;
    row.cells.forEach((c) => {
      if (c.value === null) {
        temp++;
      }
      if (c.value && c.error) {
        temp++;
      }
    });
    return acc + temp;
  }, 0);
};

interface History {
  [id: string]: GameRow[];
}

interface UpdateProgress {
  socket: Socket;
  data: GameRow[];
  history: History;
}

async function start() {
  try {
    const clients: ServerClient[] = [];
    const history: History = {};
    const progressObserv = new Subject<{ id: string; value: number }[]>();

    progressObserv.subscribe((value) => {
      const winner = value.find((el) => el.value === 100);

      if (winner) {
        io.emit(EVENTS.GAME.END, { id: winner.id });
      }
    });

    const getClients = (socket: Socket) => {
      const eIdx = clients.findIndex(({ socketId }) => socketId === socket.id);
      const rIdx = eIdx === 0 ? 1 : 0;

      return {
        emmiter: clients[eIdx],
        reflector: clients[rIdx],
      };
    };

    const calcProgress = async (history: History) => {
      const progress = clients.map(({ id }) => {
        const data = history[id];
        const closedCount = getTotalClosedCells(data);
        const MAX_CELLS = 81;

        const percantage = Math.round((1 / MAX_CELLS) * 100 * 100) / 100;
        return { id, value: closedCount ? (MAX_CELLS - closedCount) * percantage : 100 };
      });
      progressObserv.next(progress);
      return progress;
    };

    httpServer.listen();

    io.on(EVENTS.COMMON.CONNECTION, (socket) => {
      socket.on(EVENTS.PLAYER.CONNECT.CLIENT, async (data: { id: string }) => {
        const user = clients.find(({ id }) => id === data.id);
        if (!user) {
          clients.push({
            id: data.id,
            socketId: socket.id,
            online: true,
          });
        }

        const players = DTO_Players(clients);

        io.emit(EVENTS.PLAYER.CONNECT.SERVER, { players });
      });

      socket.on(EVENTS.COMMON.DISCONNECT, async () => {
        const idx = clients.findIndex(({ socketId }) => socketId === socket.id);

        if (idx >= 0) {
          clients.splice(idx, 1);
          const players = DTO_Players(clients);
          socket.broadcast.emit(EVENTS.PLAYER.DISCONNECT.SERVER, { players });
        }
      });

      // On select game difficulty
      socket.on(EVENTS.DIFF.CLIENT, async ({ diff }: { diff: Diff }) => {
        // Push loading state
        io.emit(EVENTS.GAME.PREPARE.SERVER);

        // Get random game from db by choosen difficulty
        const data = await getRandomPuzzle(diff);
        const dat = {
          id: 2,
          puzzle:
            "..4817256728653419615942738176425893452398167389176542897564321563281974241739685",
          solution:
            "934817256728653419615942738176425893452398167389176542897564321563281974241739685",
          clues: 23,
          difficulty: 0,
        };
        const transformedData = transformData(data);

        // Set initial history state for both players
        clients.forEach(({ id }) => {
          history[id] = transformedData;
        });

        // Push game for each client
        io.emit(EVENTS.GAME.START.SERVER, { data: transformedData });

        // Push players progress
        const progress = await calcProgress(history);

        setTimeout(() => {
          clients.forEach((client) => {
            io.to(client.socketId).emit(EVENTS.GAME.UPDATE_PROGRESS, { data: progress });
          });
        }, 500);
      });

      const updateProgress = async ({ socket, data, history }: UpdateProgress) => {
        const players = getClients(socket);
        const { emmiter, reflector } = players;

        if (!emmiter || !reflector) return;
        history[emmiter.id] = data;
        const progress = await calcProgress(history);
        io.emit(EVENTS.GAME.UPDATE_PROGRESS, { data: progress });
        return players;
      };

      socket.on(EVENTS.CELL.OPENED, async ({ data }: { data: GameRow[] }) => {
        updateProgress({ socket, data, history });
      });

      socket.on(EVENTS.CELL.TIPED.CLIENT, async ({ data }: { data: GameRow[] }) => {
        const players = await updateProgress({ socket, data, history });
        if (!players) return;

        // Push event to open random cell
        io.to(players.reflector.socketId).emit(EVENTS.CELL.TIPED.SERVER);
      });

      socket.on(EVENTS.CELL.MISTAKE.CLIENT, async ({ data }: { data: GameRow[] }) => {
        const players = await updateProgress({ socket, data, history });
        if (!players) return;

        // Push event to open random cell
        io.to(players.reflector.socketId).emit(EVENTS.CELL.TIPED.SERVER);
      });

      socket.on(EVENTS.GAME.RESTART.CLIENT, async () => {
        // Reset history
        for (const key in history) {
          if (Object.prototype.hasOwnProperty.call(history, key)) {
            history[key] = [];
          }
        }

        // Reset progress
        const clearProgress = clients.map(({ id }) => id).map((id) => ({ id, value: 0 }));
        progressObserv.next(clearProgress);

        io.emit(EVENTS.GAME.RESTART.SERVER);
      });
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

start();
