"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouponTC = exports.Coupon = exports.CouponSchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CouponSchema = exports.CouponSchema = new _mongoose.Schema({
  taken: {
    type: Boolean,
    default: false
  },
  sold: {
    type: Boolean,
    default: false
  },
  value: {
    type: Number
  },
  subscription: {
    type: String,
    enum: ["FEATHER_0", "FEATHER_1", "FEATHER_2", "FEATHER_3", "FEATHER_4"]
  },
  owner: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  business: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "Business"
  }
}, {
  collection: "coupons"
});
CouponSchema.plugin(_mongooseTimestamp2.default);
CouponSchema.index({
  createdAt: 1,
  updatedAt: 1
});

const Coupon = exports.Coupon = _mongoose2.default.model("Coupon", CouponSchema);

const CouponTC = exports.CouponTC = (0, _graphqlComposeMongoose.composeWithMongoose)(Coupon);