"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouponMutation = exports.CouponQuery = undefined;

var _coupon = require("../models/coupon");

var _user = require("../models/user");

var _business = require("../models/business");

const CouponQuery = {
  couponById: _coupon.CouponTC.getResolver("findById"),
  couponByIds: _coupon.CouponTC.getResolver("findByIds"),
  couponOne: _coupon.CouponTC.getResolver("findOne"),
  couponMany: _coupon.CouponTC.getResolver("findMany"),
  couponCount: _coupon.CouponTC.getResolver("count"),
  couponConnection: _coupon.CouponTC.getResolver("connection"),
  couponPagination: _coupon.CouponTC.getResolver("pagination"),
  owner: _coupon.CouponTC.addRelation("owner", {
    resolver: () => _user.UserTC.getResolver("findById"),
    prepareArgs: {
      _id: source => source.owner
    },
    projection: {
      owner: 1
    }
  }),
  business: _coupon.CouponTC.addRelation("business", {
    resolver: () => _business.BusinessTC.getResolver("findById"),
    prepareArgs: {
      _id: source => source.business
    },
    projection: {
      business: 1
    }
  })
};
const CouponMutation = {
  couponCreateOne: _coupon.CouponTC.getResolver("createOne"),
  couponCreateMany: _coupon.CouponTC.getResolver("createMany"),
  couponUpdateById: _coupon.CouponTC.getResolver("updateById"),
  couponUpdateOne: _coupon.CouponTC.getResolver("updateOne"),
  couponUpdateMany: _coupon.CouponTC.getResolver("updateMany"),
  couponRemoveById: _coupon.CouponTC.getResolver("removeById"),
  couponRemoveOne: _coupon.CouponTC.getResolver("removeOne"),
  couponRemoveMany: _coupon.CouponTC.getResolver("removeMany")
};
exports.CouponQuery = CouponQuery;
exports.CouponMutation = CouponMutation;