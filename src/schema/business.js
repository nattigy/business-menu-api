import {BusinessTC, Business} from "../models/business";
import {CategoryTC} from "../models/category";
import {User, UserTC} from "../models/user";
import {PostTC} from "../models/post";
import {EventTC} from "../models/event";

BusinessTC.addResolver({
    name: "getBusinesses",
    kind: "query",
    type: BusinessTC.getResolver("findMany").getType(),
    args: {"user_id": "String", limit: "Int", sort: "String"},
    resolve: async ({args}) => {
        let businesses = await Business.find()
            .sort({"subscription": args.sort}).limit(args.limit);
        businesses = businesses.map(e => ({...e._doc, isLiked: e._doc.favoriteList.includes(args.user_id)}));
        return businesses;
    },
});

const BusinessQuery = {
    businessById: BusinessTC.getResolver("findById"),
    businessByIds: BusinessTC.getResolver("findByIds"),
    businessOne: BusinessTC.getResolver("findOne"),
    businessMany: BusinessTC.getResolver("findMany"),
    getBusinesses: BusinessTC.getResolver("getBusinesses"),
    businessCount: BusinessTC.getResolver("count"),
    businessConnection: BusinessTC.getResolver("connection"),
    businessPagination: BusinessTC.getResolver("pagination"),
    businessPosts: BusinessTC.addRelation("posts", {
        resolver: () => PostTC.getResolver("findByIds"),
        prepareArgs: {
            _ids: (source) => source.posts,
        },
        projection: {posts: 1},
    }),
    businessEvents: BusinessTC.addRelation("events", {
        resolver: () => EventTC.getResolver("findByIds"),
        prepareArgs: {
            _ids: (source) => source.events,
        },
        projection: {events: 1},
    }),
    businessCategories: BusinessTC.addRelation("categories", {
        resolver: () => CategoryTC.getResolver("findByIds"),
        prepareArgs: {
            _ids: (source) => source.categories,
        },
        projection: {categories: 1},
    }),
    businessOwner: BusinessTC.addRelation("owner", {
        resolver: () => UserTC.getResolver("findById"),
        prepareArgs: {
            _id: (source) => source.owner,
        },
        projection: {owner: 1},
    }),
};

BusinessTC.addFields({
    likeCount: {
        type: 'Int',
        resolve: (business) => business ? business.favoriteList ? business.favoriteList.length : 0 : 0,
    },
});

BusinessTC.addResolver({
    name: "addToFavorite",
    kind: "mutation",
    type: BusinessTC,
    args: {"user_id": "String", business_id: "String"},
    resolve: async ({args}) => {
        await Business.updateOne(
            {_id: args.business_id},
            {$addToSet: {favoriteList: args.user_id}}
        ).then(async () => {
            await User.updateOne(
                {_id: args.user_id},
                {$addToSet: {favorites: args.business_id}}
            );
        }).catch((error) => error);
        return Business.findById(args.business_id);
    },
});

BusinessTC.addResolver({
    name: "removeFromFavorite",
    kind: "mutation",
    type: BusinessTC,
    args: {"user_id": "String", business_id: "String"},
    resolve: async ({args}) => {
        await Post.updateOne(
            {_id: args.post_id},
            {$pull: {favoriteList: args.user_id}}
        ).then(async () => {
            await User.updateOne(
                {_id: args.user_id},
                {$pull: {favorites: args.business_id}}
            );
        }).catch((error) => error);
        return Business.findById(args.business_id);
    },
});

const BusinessMutation = {
    businessCreateOne: BusinessTC.getResolver("createOne"),
    businessCreateMany: BusinessTC.getResolver("createMany"),
    businessUpdateById: BusinessTC.getResolver("updateById"),
    addToFavorite: BusinessTC.getResolver("addToFavorite"),
    removeFromFavorite: BusinessTC.getResolver("removeFromFavorite"),
    businessUpdateOne: BusinessTC.getResolver("updateOne"),
    businessUpdateMany: BusinessTC.getResolver("updateMany"),
    businessRemoveById: BusinessTC.getResolver("removeById"),
    businessRemoveOne: BusinessTC.getResolver("removeOne"),
    businessRemoveMany: BusinessTC.getResolver("removeMany"),
};

export {BusinessQuery, BusinessMutation};
