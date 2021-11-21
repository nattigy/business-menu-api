import dotenv from "dotenv";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import schema from "./schema";
import {userService} from "./utils/userService";
import {authentication} from "./middleware/authentication";
import "./config/mongodb-config";

dotenv.config();
const app = express();

const server = new ApolloServer({
  schema,
  playground: true,
  introspection: true,
  tracing: true,
  path: "/",
  context: ({req}) => {
    const token = req.headers.authorization || '';
    return {
      user: userService.getUser(token.replace("Bearer ", "")) || null,
      headers: req.headers,
      accessToken: req.headers.authorization,
      phoneVerification: req.headers.phoneverification || '',
      // i18n: req.headers.i18n
    };
  },
});

server.applyMiddleware({
  app,
  path: "/",
  cors: "no-cors",
  authentication,
  // language: i18nextMiddleware.handle(i18next),
});

app.listen({port: process.env.PORT}, () => {
  console.log(`🚀 Server listening on port ${process.env.PORT}`);
});
