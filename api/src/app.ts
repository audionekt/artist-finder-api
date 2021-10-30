import "reflect-metadata";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { UserResolver } from "./resolvers/user.resolver";
import { BandResolver } from "./resolvers/band.resolver";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-koa";
import { createConnection } from "typeorm";
import http from "http";
import Koa from "koa";
import dotenv from "dotenv";
import { config } from "./config";
import session from "koa-session";
import redisStore from "koa-redis";
import { redis } from "./redis/client";
import { TIME } from "./utils/time-intervals";
import { MyContext } from "./types/context.type";

async function startServer() {
  dotenv.config();
  const { server_port } = config;

  await createConnection();
  const httpServer = http.createServer();

  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [UserResolver, BandResolver],
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ ctx }): MyContext => ({ ctx, redis }),
  });

  await server.start();
  const app = new Koa();
  app.keys = ["Shh, its a secret!"];

  app.use(
    session(
      {
        key: "qid",
        store: redisStore({ client: redis }),
        maxAge: TIME.ONE_DAY,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      },
      app
    )
  );


  // app.use(ctx => {
  //   // ignore favicon
  //   if (ctx.path === '/favicon.ico') return;
  
  //   let n = ctx.session!.views || 0;
  //   ctx.session!.views = ++n;
  //   ctx.body = n + ' views';
  // });
  
  server.applyMiddleware({ app, cors: false });
  httpServer.on("request", app.callback());
  await new Promise((resolve: any) =>
    httpServer.listen({ port: server_port }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${server_port}${server.graphqlPath}`
  );
  return { server, app };
}

startServer();
