"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserTC = exports.User = exports.UserSchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = exports.UserSchema = new _mongoose.Schema({
  fullName: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  firebaseId: {
    type: String
  },
  password: {
    type: String
  },
  userType: {
    type: String,
    enum: ["Normal", "Owner", "Admin", "Sales"]
  },
  interestedInEvents: {
    type: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }],
    default: []
  },
  favorites: {
    type: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: "Business"
    }],
    default: []
  },
  likedPosts: {
    type: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }],
    default: []
  },
  businesses: {
    type: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: "Business"
    }],
    default: []
  },
  coupons: {
    type: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: "Coupon"
    }],
    default: []
  }
}, {
  collection: "users"
});
UserSchema.plugin(_mongooseTimestamp2.default);
UserSchema.index({
  createdAt: 1,
  updatedAt: 1
});

const User = exports.User = _mongoose2.default.model("User", UserSchema);

const UserTC = exports.UserTC = (0, _graphqlComposeMongoose.composeWithMongoose)(User);