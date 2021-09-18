import dotenv from "dotenv";
import express from "express";
import {ApolloServer, PubSub } from "apollo-server-express";

// import cookieParser from "cookie-parser";
// import csrf from "csurf";
// import bodyParser from "body-parser";

import "./config/mongodb-config";
import schema from "./schema";

// const csrfMiddleware = csrf({ cookie: true });

dotenv.config();
const app = express();
const pubSub = new PubSub();

// app.use(cookieParser());
// app.use(csrfMiddleware);

// app.all("*", (req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   next();
// });

const server = new ApolloServer({
  schema,
  playground: true,
  introspection: true,
  tracing: true,
  path: "/",
  context: ({ req }) => ({ req, pubSub })
});

server.applyMiddleware({
  app,
  path: "/",
  cors: "no-cors",
});

app.listen({port: process.env.PORT}, () => {
  console.log(`🚀 Server listening on port ${process.env.PORT}`);
});
