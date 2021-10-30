// import { Context } from "koa";
import { ContextSession, Session } from "koa-session";
import { Redis } from "ioredis";

export type MyContext = {
  ctx: ContextSession & { session: Session };
  redis: Redis;
};
