"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BusinessListTC = exports.BusinessList = exports.BusinessListSchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BusinessListSchema = exports.BusinessListSchema = new _mongoose.Schema({
  autocompleteTerm: {
    type: String,
    index: true
  }
}, {
  collection: "businessLists"
});
BusinessListSchema.plugin(_mongooseTimestamp2.default);
BusinessListSchema.index({
  createdAt: 1,
  updatedAt: 1
});

const BusinessList = exports.BusinessList = _mongoose2.default.model("BusinessList", BusinessListSchema);

const BusinessListTC = exports.BusinessListTC = (0, _graphqlComposeMongoose.composeWithMongoose)(BusinessList);