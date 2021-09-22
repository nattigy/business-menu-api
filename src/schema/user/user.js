import {UserTC} from "../../models/user";
import {BusinessTC} from "../../models/business";
import {PostTC} from "../../models/post";
import {EventTC} from "../../models/event";
import {CouponTC} from "../../models/coupon";

import {authMiddleware as middleware} from "../../middleware/authMiddleware";
import {userValidator as validator} from "../../validator/userValidator";
import Resolvers from "./resolvers";

for (const resolver in Resolvers) {
  UserTC.addResolver(Resolvers[resolver]);
}

const UserQuery = {
  userById: UserTC.getResolver("findById"),
  userByIds: UserTC.getResolver("findByIds"),
  userOne: UserTC.getResolver("findOne"),
  userMany: UserTC.getResolver("findMany"),
  userCount: UserTC.getResolver("count"),
  userConnection: UserTC.getResolver("connection"),
  userPagination: UserTC.getResolver("pagination"),
  user: UserTC.getResolver('user', [middleware.isAuth]),
  interestedInEvents: UserTC.addRelation("interestedInEvents", {
    resolver: () => EventTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.interestedInEvents,
    },
    projection: {interestedInEvents: 1},
  }),
  likedPosts: UserTC.addRelation("likedPosts", {
    resolver: () => PostTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.likedPosts,
    },
    projection: {likedPosts: 1},
  }),
  favorites: UserTC.addRelation("favorites", {
    resolver: () => BusinessTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.favorites,
    },
    projection: {favorites: 1},
  }),
  businesses: UserTC.addRelation("businesses", {
    resolver: () => BusinessTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.businesses,
    },
    projection: {businesses: 1},
  }),
  coupons: UserTC.addRelation("coupons", {
    resolver: () => CouponTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.coupons,
    },
    projection: {coupons: 1},
  }),
};

const UserMutation = {
  userCreateOne: UserTC.getResolver("createOne"),
  userCreateMany: UserTC.getResolver("createMany"),
  userUpdateById: UserTC.getResolver("updateById"),
  userUpdateOne: UserTC.getResolver("updateOne"),
  userUpdateMany: UserTC.getResolver("updateMany"),
  userRemoveById: UserTC.getResolver("removeById"),
  userRemoveOne: UserTC.getResolver("removeOne"),
  userRemoveMany: UserTC.getResolver("removeMany"),
  userAddCoupon: UserTC.getResolver("userAddCoupon"),

  signIn: UserTC.getResolver('signIn', [middleware.isGuest, validator.signIn]),
  signUp: UserTC.getResolver('signUp', [middleware.isGuest, validator.signUp]),
  // logout: UserTC.getResolver('logout', [middleware.isAuth]),
  verifyRequest: UserTC.getResolver('verifyRequest', [middleware.isAuth, middleware.isUnverified]),
  verify: UserTC.getResolver('verify'),
  resetPassword: UserTC.getResolver('resetPassword', [middleware.isGuest, validator.resetPassword]),
  newPassword: UserTC.getResolver('newPassword', [middleware.isGuest, validator.newPassword]),
  changePassword: UserTC.getResolver('changePassword', [
    middleware.isAuth,
    validator.changePassword
  ]),
  updateUser: UserTC.getResolver('updateUser', [middleware.isAuth, validator.updateUser]),
  switchLocale: UserTC.getResolver('switchLocale', [middleware.isAuth])
};

export {UserQuery, UserMutation};
