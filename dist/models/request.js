"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestTC = exports.Request = exports.RequestSchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RequestSchema = exports.RequestSchema = new _mongoose.Schema({
  reference: {
    type: String
  },
  amount: {
    type: Number
  },
  bankName: {
    type: String
  },
  dateDeposited: {
    type: Date
  },
  status: {
    type: String,
    enum: ["PENDING", "DONE", "NOT_DEPOSITED", "NOT_FOUND"],
    default: "PENDING"
  },
  business: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "Business"
  }
}, {
  collection: "requests"
});
RequestSchema.plugin(_mongooseTimestamp2.default);
RequestSchema.index({
  createdAt: 1,
  updatedAt: 1
});

const Request = exports.Request = _mongoose2.default.model("Request", RequestSchema);

const RequestTC = exports.RequestTC = (0, _graphqlComposeMongoose.composeWithMongoose)(Request);