"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CategoryTC = exports.Category = exports.CategorySchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CategorySchema = exports.CategorySchema = new _mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  parent: {
    type: String
  },
  autocompleteTerm: {
    type: String
  },
  categoryIndex: {
    type: [String],
    index: true
  }
}, {
  collection: "categories"
});
CategorySchema.plugin(_mongooseTimestamp2.default);
CategorySchema.index({
  createdAt: 1,
  updatedAt: 1
});

const Category = exports.Category = _mongoose2.default.model("Category", CategorySchema);

const CategoryTC = exports.CategoryTC = (0, _graphqlComposeMongoose.composeWithMongoose)(Category);