import { ServerOptions } from "socket.io";
import { ADDRESS, CLIENT_PORT } from "../lib";

const ioServerOptions: Partial<ServerOptions> = {
  cors: {
    origin: [
      `http://localhost:${CLIENT_PORT}`,
      `http://${ADDRESS}:${CLIENT_PORT}`,
      `https://sudok-serv.onrender.com/`,
      `https://mischuk.github.io/sudok-client/`,
    ],
    methods: ["GET", "POST"],
  },
};

export { ioServerOptions };
