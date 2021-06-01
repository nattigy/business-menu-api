"use strict";

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _apolloServerExpress = require("apollo-server-express");

require("./utils/db");

var _schema = require("./schema");

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const app = (0, _express2.default)();
const server = new _apolloServerExpress.ApolloServer({
  schema: _schema2.default,
  playground: true,
  introspection: true,
  tracing: true,
  path: "/"
});
server.applyMiddleware({
  app,
  path: "/",
  cors: "no-cors"
});
app.listen({
  port: process.env.PORT
}, () => {
  console.log(`🚀 Server listening on port ${process.env.PORT}`);
});