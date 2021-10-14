import {TemporaryModel, TemporaryTC} from "../../models/temporary";
import {CategoryTC} from "../../models/category";
import {UserTC} from "../../models/user";
import {PostTC} from "../../models/post";
import {EventTC} from "../../models/event";

import {authMiddleware as middleware} from "../../middleware/authMiddleware";

const TemporaryQuery = {
  temporaryById: TemporaryTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]),
  temporaryByIds: TemporaryTC.getResolver("findByIds", [middleware.isAuth, middleware.isAdmin]),
  temporaryOne: TemporaryTC.getResolver("findOne", [middleware.isAuth, middleware.isAdmin]),
  temporaryMany: TemporaryTC.getResolver("findMany", [middleware.isAuth, middleware.isAdmin]),
  temporaryPagination: TemporaryTC.getResolver("pagination", [middleware.isAuth, middleware.isAdmin]),
  temporaryPosts: TemporaryTC.addRelation("posts", {
    resolver: () => PostTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.posts,
    },
    projection: {posts: 1},
  }),
  temporaryEvents: TemporaryTC.addRelation("events", {
    resolver: () => EventTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.events,
    },
    projection: {events: 1},
  }),
  temporaryCategories: TemporaryTC.addRelation("categories", {
    resolver: () => CategoryTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.categories,
    },
    projection: {categories: 1},
  }),
  temporaryOwner: TemporaryTC.addRelation("owner", {
    resolver: () => UserTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: {owner: 1},
  }),
  temporaryIsLiked: TemporaryTC.addFields({
    likeCount: {
      type: 'Int',
      resolve: (Temporary) => Temporary ? Temporary.favoriteList ? Temporary.favoriteList.length : 0 : 0,
    },
    isLiked: {
      type: 'Boolean',
      resolve: (Temporary, _, {user}) => {
        const biz = TemporaryModel.findById(Temporary._id, {favoriteList: 1});
        return biz.favoriteList.contains(user._id);
      },
    },
    favoriteList: {
      type: '[MongoID]',
      resolve: () => []
    }
  }),
};

const TemporaryMutation = {
  temporaryCreateOne: TemporaryTC.getResolver("createOne", [middleware.isAuth, middleware.isAdmin]),
  temporaryCreateMany: TemporaryTC.getResolver("createMany", [middleware.isAuth, middleware.isAdmin]),
  temporaryUpdateById: TemporaryTC.getResolver("updateById", [middleware.isAuth, middleware.isAdmin]),
  temporaryUpdateOne: TemporaryTC.getResolver("updateOne", [middleware.isAuth, middleware.isAdmin]),
  temporaryUpdateMany: TemporaryTC.getResolver("updateMany", [middleware.isAuth, middleware.isAdmin]),
  temporaryRemoveById: TemporaryTC.getResolver("removeById", [middleware.isAuth, middleware.isAdmin]),
  temporaryRemoveOne: TemporaryTC.getResolver("removeOne", [middleware.isAuth, middleware.isAdmin]),
  temporaryRemoveMany: TemporaryTC.getResolver("removeMany", [middleware.isAuth, middleware.isAdmin]),
};

export {TemporaryQuery, TemporaryMutation};
