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
  userById: UserTC.getResolver("findById",[middleware.isAuth, middleware.isAdmin]),
  userByIds: UserTC.getResolver("findByIds",[middleware.isAuth, middleware.isAdmin]),
  userOne: UserTC.getResolver("findOne",[middleware.isAuth, middleware.isAdmin]),
  userMany: UserTC.getResolver("findMany",[middleware.isAuth, middleware.isAdmin]),
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
  userCreateOne: UserTC.getResolver("createOne", [middleware.isAuth, middleware.isAdmin]),
  userCreateMany: UserTC.getResolver("createMany",[middleware.isAuth, middleware.isAdmin]),
  userUpdateById: UserTC.getResolver("updateById",[middleware.isAuth, middleware.isValidated]),
  userUpdateOne: UserTC.getResolver("updateOne",[middleware.isAuth, middleware.isAdmin]),
  userUpdateMany: UserTC.getResolver("updateMany",[middleware.isAuth, middleware.isAdmin]),
  userRemoveById: UserTC.getResolver("removeById",[middleware.isAuth, middleware.isAdmin]),
  userRemoveOne: UserTC.getResolver("removeOne",[middleware.isAuth, middleware.isAdmin]),
  userRemoveMany: UserTC.getResolver("removeMany",[middleware.isAuth, middleware.isAdmin]),
  userAddCoupon: UserTC.getResolver("userAddCoupon",[middleware.isAuth, middleware.isAdmin]),

  signIn: UserTC.getResolver('signIn', [middleware.isGuest, validator.signIn]),
  userSignUp: UserTC.getResolver('userSignUp', [middleware.isGuest, validator.signUp]),
  ownerSignUp: UserTC.getResolver('ownerSignUp', [middleware.isPhoneVerified, middleware.isGuest, validator.signUp]),
  // logout: UserTC.getResolver('logout', [middleware.isAuth]),
  verifyRequest: UserTC.getResolver('verifyRequest', [middleware.isAuth, middleware.isUnverified]),
  verify: UserTC.getResolver('verify'),
  resetPassword: UserTC.getResolver('resetPassword', [middleware.isGuest, validator.resetPassword]),
  newPassword: UserTC.getResolver('newPassword', [middleware.isGuest, validator.newPassword]),
  changePassword: UserTC.getResolver('changePassword', [middleware.isAuth, validator.changePassword]),
  updateUser: UserTC.getResolver('updateUser', [middleware.isAuth, validator.updateUser]),
  // switchLocale: UserTC.getResolver('switchLocale', [middleware.isAuth])
};

export {UserQuery, UserMutation};
