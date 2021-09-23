import dotenv from "dotenv";
import express from "express";
import {ApolloServer} from "apollo-server-express";

// import cookieParser from "cookie-parser";
// import csrf from "csurf";
// import bodyParser from "body-parser";

import schema from "./schema";
import {userService} from "./utils/userService";
import {authentication} from "./middleware/authentication";
import { i18next, i18nextMiddleware } from './i18next/index';

// import "./config/redis-config";
import "./config/mongodb-config";

// const csrfMiddleware = csrf({ cookie: true });

dotenv.config();
const app = express();

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
  context: ({req}) => {
    const token = req.headers.authorization || '';
    return {
      user: userService.getUser(token.replace('Bearer', '')),
      headers: req.headers,
      accessToken: req.headers.authorization,
      phoneVerification: req.headers.phoneverification || '',
      i18n: req.headers.i18n
    };
  },
});

server.applyMiddleware({
  app,
  path: "/",
  cors: "no-cors",
  authentication,
  language: i18nextMiddleware.handle(i18next),
});

app.listen({port: process.env.PORT}, () => {
  console.log(`🚀 Server listening on port ${process.env.PORT}`);
});
