import dotenv from "dotenv";
import express from "express";
import {ApolloServer} from "apollo-server-express";

import "./utils/db";
import schema from "./schema";

dotenv.config();

const app = express();

const server = new ApolloServer({
  schema,
  playground: false,
  introspection: false,
  tracing: true,
  path: "/",
});

server.applyMiddleware({
  app,
  path: "/",
  cors: "no-cors",
});

app.listen({port: process.env.PORT}, () => {
  console.log(`🚀 Server listening on port ${process.env.PORT}`);
});
