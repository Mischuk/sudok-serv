import { ServerOptions } from "socket.io";

const ioServerOptions: Partial<ServerOptions> = {
  cors: {
    origin: "https://mischuk.github.io",
    credentials: false,
  },
};

export { ioServerOptions };
