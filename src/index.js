import dotenv from "dotenv";
import express from "express";
// import bodyParser from "body-parser";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import "./utils/db";
import schema from "./schema";

dotenv.config();

const app = express();

// app.use(bodyParser.json());

// app.use(cors({
//   credentials: true,
//   // origin: 'http://localhost:8000',
// }));

// app.use((req, res, next) => {
// res.setHeader("Access-Control-Allow-Origin", "*");
// res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
// res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

const server = new ApolloServer({
  schema,
  playground: true,
  introspection: true,
  tracing: true,
  path: "/",
});

server.applyMiddleware({
  app,
  path: "/",
  cors: "no-cors",
});

app.listen({ port: process.env.PORT }, () => {
  console.log(`🚀 Server listening on port ${process.env.PORT}`);
});
