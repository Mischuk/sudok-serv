import { ServerOptions } from "socket.io";

const ioServerOptions: Partial<ServerOptions> = {
  cors: {
    origin: "*",
    credentials: false,
  },
};

export { ioServerOptions };
