export const EVENTS = {
  COMMON: {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
  },
  PLAYER: {
    CONNECT: {
      SERVER: "S_PLAYER_CONNECT",
      CLIENT: "C_PLAYER_CONNECT",
    },
    DISCONNECT: {
      SERVER: "S_PLAYER_DISCONNECT",
      CLIENT: "C_PLAYER_DISCONNECT",
    },
    PING: {
      SERVER: "S_PLAYER_PING",
      CLIENT: "C_PLAYER_PING",
    },
  },
  DIFF: {
    SERVER: "S_DIFF",
    CLIENT: "C_DIFF",
  },
  GAME: {
    START: {
      SERVER: "S_GAME_START",
    },
    PREPARE: {
      SERVER: "S_GAME_PREPARE",
    },
    UPDATE_PROGRESS: "GAME_UPDATE_PROGRESS",
    END: "GAME_END",
    RESTART: {
      CLIENT: "C_GAME_RESTART",
      SERVER: "S_GAME_RESTART",
    },
  },
  CELL: {
    OPENED: "CELL_OPENED",
    TIPED: {
      CLIENT: "C_CELL_TIPED",
      SERVER: "S_CELL_TIPED",
    },
    MISTAKE: {
      CLIENT: "C_CELL_MISTAKE",
      SERVER: "S_CELL_MISTAKE",
    },
  },
};
