import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { createConnection } from "typeorm";
import { IResolvers } from "@graphql-tools/utils";
import { ApolloServer } from "apollo-server-koa";
import { UsersResolver } from "./resolvers/user.resolver";
import { UsersTypeDef } from "./typedefs/user.typedef";
import { DocumentNode } from "graphql";
import http from "http";
import Koa from "koa";

let typeDefs = mergeTypeDefs([UsersTypeDef]);
let resolvers = mergeResolvers([UsersResolver]);

async function startServer(typeDefs: DocumentNode, resolvers: IResolvers) {
  await createConnection();
  const httpServer = http.createServer();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  const app = new Koa();
  server.applyMiddleware({ app });
  httpServer.on("request", app.callback());
  await new Promise((resolve: any) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

startServer(typeDefs, resolvers);
