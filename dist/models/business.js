"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BusinessTC = exports.Business = exports.BusinessSchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const openHoursSchema = new _mongoose.Schema({
  day: {
    type: String
  },
  opens: {
    type: String
  },
  closes: {
    type: String
  },
  isOpen: {
    type: Boolean
  }
});
const menuListSchema = new _mongoose.Schema({
  image: {
    type: String
  },
  name: {
    type: String
  },
  price: {
    type: String
  }
});
const restaurantMenuSchema = new _mongoose.Schema({
  category: {
    type: String
  },
  menuList: {
    type: [menuListSchema],
    default: []
  }
});
const BusinessSchema = exports.BusinessSchema = new _mongoose.Schema({
  businessName: {
    type: String,
    trim: true,
    index: true,
    default: ""
  },
  phoneNumber: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    index: true,
    default: ""
  },
  locationDescription: {
    type: String,
    index: true,
    default: ""
  },
  lat: {
    type: Number,
    index: true
  },
  lng: {
    type: Number,
    index: true
  },
  emails: {
    type: [String],
    trim: true,
    default: []
  },
  website: {
    type: String,
    default: ""
  },
  logoPics: {
    type: String,
    default: ""
  },
  slogan: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  specialization: {
    type: String,
    default: ""
  },
  history: {
    type: String,
    default: ""
  },
  establishedIn: {
    type: String,
    default: ""
  },
  subscription: {
    type: String,
    enum: ["FEATHER_0", "FEATHER_1", "FEATHER_2", "FEATHER_3", "FEATHER_4", "SPONSORED"],
    default: "FEATHER_0"
  },
  state: {
    type: String,
    enum: ["ACTIVE", "BLOCKED"],
    default: "ACTIVE"
  },
  openHours: {
    type: [openHoursSchema],
    default: []
  },
  restaurantMenu: {
    type: [restaurantMenuSchema],
    default: []
  },
  searchIndex: {
    type: [String],
    index: true,
    default: []
  },
  pictures: {
    type: [String],
    default: []
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  favoriteList: {
    type: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    default: []
  },
  posts: {
    type: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }],
    default: []
  },
  events: {
    type: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }],
    default: []
  },
  categories: {
    type: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }],
    default: []
  },
  owner: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  collection: "businesses"
});
BusinessSchema.plugin(_mongooseTimestamp2.default);
BusinessSchema.index({
  createdAt: 1,
  updatedAt: 1
});

const Business = exports.Business = _mongoose2.default.model("Business", BusinessSchema);

const BusinessTC = exports.BusinessTC = (0, _graphqlComposeMongoose.composeWithMongoose)(Business);