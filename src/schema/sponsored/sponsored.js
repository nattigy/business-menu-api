import {SponsoredModel, SponsoredTC} from "../../models/sponsored";
import {CategoryTC} from "../../models/category";
import {UserTC} from "../../models/user";
import {PostTC} from "../../models/post";
import {EventTC} from "../../models/event";

import {authMiddleware as middleware} from "../../middleware/authMiddleware";

const SponsoredQuery = {
  sponsoredById: SponsoredTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]),
  sponsoredByIds: SponsoredTC.getResolver("findByIds", [middleware.isAuth, middleware.isAdmin]),
  sponsoredOne: SponsoredTC.getResolver("findOne", [middleware.isAuth, middleware.isAdmin]),
  sponsoredMany: SponsoredTC.getResolver("findMany", [middleware.isAuth, middleware.isAdmin]),
  sponsoredPagination: SponsoredTC.getResolver("pagination", [middleware.isAuth, middleware.isAdmin]),
  sponsoredPosts: SponsoredTC.addRelation("posts", {
    resolver: () => PostTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.posts,
    },
    projection: {posts: 1},
  }),
  sponsoredEvents: SponsoredTC.addRelation("events", {
    resolver: () => EventTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.events,
    },
    projection: {events: 1},
  }),
  sponsoredCategories: SponsoredTC.addRelation("categories", {
    resolver: () => CategoryTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.categories,
    },
    projection: {categories: 1},
  }),
  sponsoredOwner: SponsoredTC.addRelation("owner", {
    resolver: () => UserTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: {owner: 1},
  }),
  sponsoredIsLiked: SponsoredTC.addFields({
    likeCount: {
      type: 'Int',
      resolve: (Sponsored) => Sponsored ? Sponsored.favoriteList ? Sponsored.favoriteList.length : 0 : 0,
    },
    isLiked: {
      type: 'Boolean',
      resolve: (Sponsored, _, {user}) => {
        const biz = SponsoredModel.findById(Sponsored._id, {favoriteList: 1});
        return biz.favoriteList.contains(user._id);
      },
    },
    favoriteList: {
      type: '[MongoID]',
      resolve: () => []
    }
  }),
};

const SponsoredMutation = {
  sponsoredCreateOne: SponsoredTC.getResolver("createOne", [middleware.isAuth, middleware.isAdmin]),
  sponsoredCreateMany: SponsoredTC.getResolver("createMany", [middleware.isAuth, middleware.isAdmin]),
  sponsoredUpdateById: SponsoredTC.getResolver("updateById", [middleware.isAuth, middleware.isAdmin]),
  sponsoredUpdateOne: SponsoredTC.getResolver("updateOne", [middleware.isAuth, middleware.isAdmin]),
  sponsoredUpdateMany: SponsoredTC.getResolver("updateMany", [middleware.isAuth, middleware.isAdmin]),
  sponsoredRemoveById: SponsoredTC.getResolver("removeById", [middleware.isAuth, middleware.isAdmin]),
  sponsoredRemoveOne: SponsoredTC.getResolver("removeOne", [middleware.isAuth, middleware.isAdmin]),
  sponsoredRemoveMany: SponsoredTC.getResolver("removeMany", [middleware.isAuth, middleware.isAdmin]),
};

export {SponsoredQuery, SponsoredMutation};
