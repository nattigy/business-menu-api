"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventTC = exports.Event = exports.eventSchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const eventSchema = exports.eventSchema = new _mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  link: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  videos: {
    type: [String]
  },
  photos: {
    type: [String]
  },
  isInterested: {
    type: Boolean,
    default: false
  },
  interestedUsers: {
    type: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    default: []
  },
  owner: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "Business"
  }
});
eventSchema.plugin(_mongooseTimestamp2.default);
eventSchema.index({
  createdAt: 1,
  updatedAt: 1
});

const Event = exports.Event = _mongoose2.default.model("Event", eventSchema);

const EventTC = exports.EventTC = (0, _graphqlComposeMongoose.composeWithMongoose)(Event);