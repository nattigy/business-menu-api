import { BusinessTC } from "../../models/business/business";
import { CategoryTC } from "../../models/category/category";
import { UserTC } from "../../models/user/user";
import { PostTC } from "../../models/events/post";
import { EventTC } from "../../models/events/event";

import Resolvers from "./resolvers";
import { authMiddleware as middleware } from "../../middleware/authMiddleware";

for (const resolver in Resolvers) {
  BusinessTC.addResolver(Resolvers[resolver]);
}

const BusinessQuery = {
  businessById: BusinessTC.getResolver("findById"),
  businessByIds: BusinessTC.getResolver("findByIds", [middleware.isAuth, middleware.isAdmin]),
  businessOne: BusinessTC.getResolver("findOne", [middleware.isAuth, middleware.isAdmin]),
  businessMany: BusinessTC.getResolver("findMany", [middleware.isAuth, middleware.isAdmin]),
  businessPagination: BusinessTC.getResolver("pagination", [middleware.isAuth, middleware.isAdmin]),
  getBusinessesByFilter: BusinessTC.getResolver("getBusinessesByFilter"),
  businessPosts: BusinessTC.addRelation("posts", {
    resolver: () => PostTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.posts,
    },
    projection: { posts: 1 },
  }),
  businessEvents: BusinessTC.addRelation("events", {
    resolver: () => EventTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.events,
    },
    projection: { events: 1 },
  }),
  businessCategories: BusinessTC.addRelation("categories", {
    resolver: () => CategoryTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.categories,
    },
    projection: { categories: 1 },
  }),
  businessBranches: BusinessTC.addRelation("branches", {
    resolver: () => BusinessTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.branches,
    },
    projection: { branches: 1 },
  }),
  businessOwner: BusinessTC.addRelation("owner", {
    resolver: () => UserTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: { owner: 1 },
  }),
  businessIsLiked: BusinessTC.addFields({
    likeCount: {
      type: "Int",
      resolve: (business) => business?.favoriteList ? business.favoriteList.length : 0,
    },
    isLiked: {
      type: "Boolean",
      resolve: (business, _, { user }) => business?.favoriteList.indexOf(user?._id) >= 0,
    },
    favoriteList: {
      type: "[MongoID]",
      resolve: () => [],
    },
  }),
};

const BusinessMutation = {
  businessCreateOne: BusinessTC.getResolver("createOne", [middleware.isAuth, middleware.isAdmin]),
  businessCreateMany: BusinessTC.getResolver("createMany", [middleware.isAuth, middleware.isAdmin]),
  businessUpdateById: BusinessTC.getResolver("updateById", [middleware.isAuth, middleware.isOwner]),
  businessUpdateOne: BusinessTC.getResolver("updateOne", [middleware.isAuth, middleware.isAdmin]),
  businessUpdateMany: BusinessTC.getResolver("updateMany", [middleware.isAuth, middleware.isAdmin]),
  businessRemoveById: BusinessTC.getResolver("removeById", [middleware.isAuth, middleware.isAdmin]),
  businessRemoveOne: BusinessTC.getResolver("removeOne", [middleware.isAuth, middleware.isAdmin]),
  businessRemoveMany: BusinessTC.getResolver("removeMany", [middleware.isAuth, middleware.isAdmin]),
  businessCreateOneCustom: BusinessTC.getResolver("businessCreateOneCustom", [middleware.isAuth, middleware.isOwner]),
  businessAddBranch: BusinessTC.getResolver("businessAddBranch", [middleware.isAuth, middleware.isOwner]),
  businessDeleteBranch: BusinessTC.getResolver("businessDeleteBranch", [middleware.isAuth, middleware.isOwner]),
  businessCreateManyCustom: BusinessTC.getResolver("businessCreateManyCustom", [middleware.isAuth, middleware.isAdmin]),
  businessRemoveByIdCustom: BusinessTC.getResolver("removeByIdCustom", [middleware.isAuth, middleware.isAdmin]),
  businessAddPost: BusinessTC.getResolver("businessAddPost", [middleware.isAuth, middleware.isOwner]),
  businessRemovePost: BusinessTC.getResolver("businessRemovePost", [middleware.isAuth, middleware.isOwner]),
  businessAddEvent: BusinessTC.getResolver("businessAddEvent", [middleware.isAuth, middleware.isOwner]),
  businessUpdateSubScription: BusinessTC.getResolver("businessUpdateSubSubscription", [middleware.isAuth, middleware.isOwner]),
  businessRemoveEvent: BusinessTC.getResolver("businessRemoveEvent", [middleware.isAuth, middleware.isOwner]),
  businessLikeUnLike: BusinessTC.getResolver("businessLikeUnLike", [middleware.isAuth]), // businessReset: BusinessTC.getResolver("businessReset"),
  businessAddMenuCategory: BusinessTC.getResolver("businessAddMenuCategory", [middleware.isAuth, middleware.isOwner]), // businessReset: BusinessTC.getResolver("businessReset"),
  businessAddMenuToCategory: BusinessTC.getResolver("businessAddMenuToCategory", [middleware.isAuth, middleware.isOwner]), // businessReset: BusinessTC.getResolver("businessReset"),
  businessDeleteMenuCategory: BusinessTC.getResolver("businessDeleteMenuCategory", [middleware.isAuth, middleware.isOwner]), // businessReset: BusinessTC.getResolver("businessReset"),
  businessDeleteMenuFromCategory: BusinessTC.getResolver("businessDeleteMenuFromCategory", [middleware.isAuth, middleware.isOwner]), // businessReset: BusinessTC.getResolver("businessReset"),
};

export { BusinessQuery, BusinessMutation };
