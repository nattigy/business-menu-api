import { SponsoredTC } from "../../models/business/sponsored";
import { CategoryTC } from "../../models/category/category";

import { authMiddleware as middleware } from "../../middleware/authMiddleware";

const SponsoredQuery = {
  sponsoredById: SponsoredTC.getResolver("findById"),
  sponsoredByIds: SponsoredTC.getResolver("findByIds", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  sponsoredOne: SponsoredTC.getResolver("findOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  sponsoredMany: SponsoredTC.getResolver("findMany"),
  sponsoredPagination: SponsoredTC.getResolver("pagination", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  sponsoredCategories: SponsoredTC.addRelation("categories", {
    resolver: () => CategoryTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.categories,
    },
    projection: { categories: 1 },
  }),
  // sponsoredOwner: SponsoredTC.addRelation("owner", {
  //   resolver: () => UserTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]),
  //   prepareArgs: {
  //     _id: (source) => source.owner,
  //   },
  //   projection: {owner: 1},
  // }),
  sponsoredIsLiked: SponsoredTC.addFields({
    likeCount: {
      type: "Int",
      resolve: (sponsored) =>
        sponsored?.favoriteList ? sponsored.favoriteList.length : 0,
    },
    isLiked: {
      type: "Boolean",
      resolve: (sponsored, _, { user }) =>
        sponsored?.favoriteList.indexOf(user?._id) >= 0,
    },
    favoriteList: {
      type: "[MongoID]",
      resolve: () => [],
    },
  }),
};

const SponsoredMutation = {
  sponsoredCreateOne: SponsoredTC.getResolver("createOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  sponsoredCreateMany: SponsoredTC.getResolver("createMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  sponsoredUpdateById: SponsoredTC.getResolver("updateById", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  sponsoredUpdateOne: SponsoredTC.getResolver("updateOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  sponsoredUpdateMany: SponsoredTC.getResolver("updateMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  sponsoredRemoveById: SponsoredTC.getResolver("removeById", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  sponsoredRemoveOne: SponsoredTC.getResolver("removeOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  sponsoredRemoveMany: SponsoredTC.getResolver("removeMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
};

export { SponsoredQuery, SponsoredMutation };
