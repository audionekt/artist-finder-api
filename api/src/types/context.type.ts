// import { Context } from "koa";
// import { ContextSession, Session } from "koa-session";
// import { Session, ContextSession } from "koa-session";
import { Redis } from "ioredis";

export type MyContext = {
  ctx: any;
  redis: Redis;
};
