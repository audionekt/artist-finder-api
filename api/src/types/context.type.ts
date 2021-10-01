import { Request, Response } from "koa";
export type MyContext = {
  req: Request;
  res: Response;
};
