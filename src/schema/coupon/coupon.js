import { CouponTC } from "../../models/subscription/coupon";
import { UserTC } from "../../models/user/user";
import { BusinessTC } from "../../models/business/business";

import Resolvers from "./resolvers";
import { authMiddleware as middleware } from "../../middleware/authMiddleware";

for (const resolver in Resolvers) {
  CouponTC.addResolver(Resolvers[resolver]);
}

const CouponQuery = {
  couponById: CouponTC.getResolver("findById", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  couponByIds: CouponTC.getResolver("findByIds", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  couponOne: CouponTC.getResolver("findOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  couponMany: CouponTC.getResolver("findMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  owner: CouponTC.addRelation("owner", {
    resolver: () => UserTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: { owner: 1 },
  }),
  business: CouponTC.addRelation("business", {
    resolver: () => BusinessTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.business,
    },
    projection: { business: 1 },
  }),
};

const CouponMutation = {
  createOneCustom: CouponTC.getResolver("createOneCustom", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  couponCreateMany: CouponTC.getResolver("createMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  couponUpdateById: CouponTC.getResolver("updateById", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  couponUpdateOne: CouponTC.getResolver("updateOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  couponUpdateMany: CouponTC.getResolver("updateMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  couponRemoveById: CouponTC.getResolver("removeById", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  couponRemoveOne: CouponTC.getResolver("removeOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  couponRemoveMany: CouponTC.getResolver("removeMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
};

export { CouponQuery, CouponMutation };
