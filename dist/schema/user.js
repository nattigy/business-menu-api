"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserMutation = exports.UserQuery = undefined;

var _user = require("../models/user");

var _business = require("../models/business");

var _post = require("../models/post");

var _event = require("../models/event");

var _coupon = require("../models/coupon");

const UserQuery = {
  userById: _user.UserTC.getResolver("findById"),
  userByIds: _user.UserTC.getResolver("findByIds"),
  userOne: _user.UserTC.getResolver("findOne"),
  userMany: _user.UserTC.getResolver("findMany"),
  userCount: _user.UserTC.getResolver("count"),
  userConnection: _user.UserTC.getResolver("connection"),
  userPagination: _user.UserTC.getResolver("pagination"),
  interestedInEvents: _user.UserTC.addRelation("interestedInEvents", {
    resolver: () => _event.EventTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: source => source.interestedInEvents
    },
    projection: {
      interestedInEvents: 1
    }
  }),
  likedPosts: _user.UserTC.addRelation("likedPosts", {
    resolver: () => _post.PostTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: source => source.likedPosts
    },
    projection: {
      likedPosts: 1
    }
  }),
  favorites: _user.UserTC.addRelation("favorites", {
    resolver: () => _business.BusinessTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: source => source.favorites
    },
    projection: {
      favorites: 1
    }
  }),
  businesses: _user.UserTC.addRelation("businesses", {
    resolver: () => _business.BusinessTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: source => source.businesses
    },
    projection: {
      businesses: 1
    }
  }),
  coupons: _user.UserTC.addRelation("coupons", {
    resolver: () => _coupon.CouponTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: source => source.coupons
    },
    projection: {
      coupons: 1
    }
  })
};

_user.UserTC.addResolver({
  name: "userAddCoupon",
  kind: "mutation",
  type: _user.UserTC,
  args: {
    coupon: "MongoID",
    id: "MongoID"
  },
  resolve: async ({
    args
  }) => {
    await _user.User.updateOne({
      _id: args.id
    }, {
      $addToSet: {
        coupons: args.coupon
      }
    }).catch(error => error);
    return _user.User.findById(args.id);
  }
});

const UserMutation = {
  userCreateOne: _user.UserTC.getResolver("createOne"),
  userCreateMany: _user.UserTC.getResolver("createMany"),
  userUpdateById: _user.UserTC.getResolver("updateById"),
  userUpdateOne: _user.UserTC.getResolver("updateOne"),
  userAddCoupon: _user.UserTC.getResolver("userAddCoupon"),
  userUpdateMany: _user.UserTC.getResolver("updateMany"),
  userRemoveById: _user.UserTC.getResolver("removeById"),
  userRemoveOne: _user.UserTC.getResolver("removeOne"),
  userRemoveMany: _user.UserTC.getResolver("removeMany")
};
exports.UserQuery = UserQuery;
exports.UserMutation = UserMutation;