import Redis from "ioredis";
import { config } from "../config";

const {
  redis: { port, host },
} = config;

export const redis = new Redis({
  port,
  host,
});
