import {BusinessTC} from "../../models/business";
import {CategoryTC} from "../../models/category";
import {UserTC} from "../../models/user";
import {PostTC} from "../../models/post";
import {EventTC} from "../../models/event";

import Resolvers from "./resolvers";

for (const resolver in Resolvers) {
  BusinessTC.addResolver(Resolvers[resolver]);
}

const BusinessQuery = {
  businessById: BusinessTC.getResolver("findById"),
  businessByIds: BusinessTC.getResolver("findByIds"),
  businessOne: BusinessTC.getResolver("findOne"),
  businessMany: BusinessTC.getResolver("findMany"),
  getBusinessesByFilter: BusinessTC.getResolver("getBusinessesByFilter"),
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
  businessIsLiked: BusinessTC.addFields({
    likeCount: {
      type: 'Int',
      resolve: (business) => business ? business.favoriteList ? business.favoriteList.length : 0 : 0,
    },
    isLiked: {
      type: 'Boolean',
      resolve: (source, _, context) => {
        // get user id => context.req.headers.authorization
        return false;
      },
    },
    favoriteList: {
      type: '[MongoID]',
      resolve: () => []
    }
  }),
};

const BusinessMutation = {
  businessCreateOne: BusinessTC.getResolver("createOne"),
  businessCreateMany: BusinessTC.getResolver("createMany"),
  businessUpdateById: BusinessTC.getResolver("updateById"),
  businessUpdateOne: BusinessTC.getResolver("updateOne"),
  businessUpdateMany: BusinessTC.getResolver("updateMany"),
  businessRemoveById: BusinessTC.getResolver("removeById"),
  businessRemoveOne: BusinessTC.getResolver("removeOne"),
  businessRemoveMany: BusinessTC.getResolver("removeMany"),
  businessCreateOneCustomAdmin: BusinessTC.getResolver("businessCreateOneCustomAdmin"),
  businessCreateManyCustom: BusinessTC.getResolver("businessCreateManyCustom"),
  businessRemoveByIdCustom: BusinessTC.getResolver("removeByIdCustom"),
  businessLikeUnLike: BusinessTC.getResolver("businessLikeUnLike"),
};

export {BusinessQuery, BusinessMutation};
