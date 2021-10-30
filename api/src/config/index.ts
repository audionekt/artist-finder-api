import * as Interfaces from "../interfaces";

export const config: Interfaces.IConfig = {
  server_port: parseInt(process.env.SERVER_PORT!) || 4000,
  redis: {
    host: process.env.REDIS_HOST || "0.0.0.0",
    port: parseInt(process.env.REDIS_PORT!) || 6401,
  },
};
