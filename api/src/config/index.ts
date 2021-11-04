import * as Interfaces from "../interfaces/config";

export const config: Interfaces.IConfig = {
  server_port: parseInt(process.env.SERVER_PORT!) || 4000,
  database: {
    name: process.env.DB_NAME || "test",
    admin: process.env.DB_USER || "test",
    password: process.env.DB_PASSWORD || "test",
    email: process.env.DB_EMAIL || "test@gmail.com",
    default_password: process.env.DB_DEFAULT_PASSWORD || "default_password",
  },
  redis: {
    host: process.env.REDIS_HOST || "0.0.0.0",
    port: parseInt(process.env.REDIS_PORT!) || 6401,
  },
};
