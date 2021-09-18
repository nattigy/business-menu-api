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
  // getBusinessById: BusinessTC.getResolver("getBusinessById"),
  // getBusinessesByCategory: BusinessTC.getResolver("getBusinessesByCategory"),
  // getBusinessesByFilter: BusinessTC.getResolver("getBusinessesByFilter"),
  businessById: BusinessTC.getResolver("findById"),
  businessByIds: BusinessTC.getResolver("findByIds"),
  businessOne: BusinessTC.getResolver("findOne"),
  businessMany: BusinessTC.getResolver("findMany"),
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

const BusinessMutation = {
  businessCreateOne: BusinessTC.getResolver("createOne"),
  businessCreateOneCustomAdmin: BusinessTC.getResolver("businessCreateOneCustomAdmin"),
  businessCreateMany: BusinessTC.getResolver("createMany"),
  businessCreateManyCustom: BusinessTC.getResolver("businessCreateManyCustom"),
  businessUpdateById: BusinessTC.getResolver("updateById"),
  businessAddToFavorite: BusinessTC.getResolver("businessAddToFavorite"),
  businessRemoveFromFavorite: BusinessTC.getResolver("businessRemoveFromFavorite"),
  businessUpdateOne: BusinessTC.getResolver("updateOne"),
  businessUpdateMany: BusinessTC.getResolver("updateMany"),
  businessRemoveById: BusinessTC.getResolver("removeById"),
  businessRemoveByIdCustom: BusinessTC.getResolver("removeByIdCustom"),
  businessRemoveOne: BusinessTC.getResolver("removeOne"),
  businessRemoveMany: BusinessTC.getResolver("removeMany"),
};

export {BusinessQuery, BusinessMutation};
