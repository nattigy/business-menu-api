import { CouponTC } from "../models/coupon";
import { UserTC } from "../models/user";
import { BusinessTC } from "../models/business";

const CouponQuery = {
  couponById: CouponTC.getResolver("findById"),
  couponByIds: CouponTC.getResolver("findByIds"),
  couponOne: CouponTC.getResolver("findOne"),
  couponMany: CouponTC.getResolver("findMany"),
  couponCount: CouponTC.getResolver("count"),
  couponConnection: CouponTC.getResolver("connection"),
  couponPagination: CouponTC.getResolver("pagination"),
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
  couponCreateOne: CouponTC.getResolver("createOne"),
  couponCreateMany: CouponTC.getResolver("createMany"),
  couponUpdateById: CouponTC.getResolver("updateById"),
  couponUpdateOne: CouponTC.getResolver("updateOne"),
  couponUpdateMany: CouponTC.getResolver("updateMany"),
  couponRemoveById: CouponTC.getResolver("removeById"),
  couponRemoveOne: CouponTC.getResolver("removeOne"),
  couponRemoveMany: CouponTC.getResolver("removeMany"),
};

export { CouponQuery, CouponMutation };
