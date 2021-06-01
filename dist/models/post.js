"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostTC = exports.Post = exports.postSchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const postSchema = exports.postSchema = new _mongoose.Schema({
  description: {
    type: String
  },
  videos: {
    type: [String]
  },
  photos: {
    type: [String]
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  likeList: {
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
postSchema.plugin(_mongooseTimestamp2.default);
postSchema.index({
  createdAt: 1,
  updatedAt: 1
});

const Post = exports.Post = _mongoose2.default.model("Post", postSchema);

const PostTC = exports.PostTC = (0, _graphqlComposeMongoose.composeWithMongoose)(Post);