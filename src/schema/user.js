import {User, UserTC} from "../models/user";
import {BusinessTC} from "../models/business";
import {PostTC} from "../models/post";
import {EventTC} from "../models/event";
import {CouponTC} from "../models/coupon";

const UserQuery = {
    userById: UserTC.getResolver("findById"),
    userByIds: UserTC.getResolver("findByIds"),
    userOne: UserTC.getResolver("findOne"),
    userMany: UserTC.getResolver("findMany"),
    userCount: UserTC.getResolver("count"),
    userConnection: UserTC.getResolver("connection"),
    userPagination: UserTC.getResolver("pagination"),
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

UserTC.addResolver({
    name: "userAddCoupon",
    kind: "mutation",
    type: UserTC,
    args: {coupon: "MongoID", id: "MongoID"},
    resolve: async ({args}) => {
        await User.updateOne(
            {_id: args.id},
            {$addToSet: {coupons: args.coupon}}
        ).catch((error) => error);
        return User.findById(args.id);
    },
});

const UserMutation = {
    userCreateOne: UserTC.getResolver("createOne"),
    userCreateMany: UserTC.getResolver("createMany"),
    userUpdateById: UserTC.getResolver("updateById"),
    userUpdateOne: UserTC.getResolver("updateOne"),
    userAddCoupon: UserTC.getResolver("userAddCoupon"),
    userUpdateMany: UserTC.getResolver("updateMany"),
    userRemoveById: UserTC.getResolver("removeById"),
    userRemoveOne: UserTC.getResolver("removeOne"),
    userRemoveMany: UserTC.getResolver("removeMany"),
};

export {UserQuery, UserMutation};
