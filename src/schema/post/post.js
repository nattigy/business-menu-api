import { BusinessTC } from "../../models/business/business";
import { PostTC } from "../../models/events/post";

import Resolvers from "./resolvers";
import { authMiddleware as middleware } from "../../middleware/authMiddleware";

for (const resolver in Resolvers) {
  PostTC.addResolver(Resolvers[resolver]);
}

const PostQuery = {
  postById: PostTC.getResolver("findById"),
  postByIds: PostTC.getResolver("findByIds", [middleware.isAuth, middleware.isAdmin]),
  postOne: PostTC.getResolver("findOne"),
  postMany: PostTC.getResolver("findMany"),
  postPagination: PostTC.getResolver("pagination"),
  owner: PostTC.addRelation("owner", {
    resolver: () => BusinessTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: { owner: 1 },
  }),
  postIsLiked: PostTC.addFields({
    likeCount: {
      type: "Int",
      resolve: (post) => (post?.likeList ? post.likeList.length : 0),
    },
    isLiked: {
      type: "Boolean",
      resolve: (post, _, { user }) => post.likeList.indexOf(user?._id) >= 0,
    },
    likeList: {
      type: "[MongoID]",
      resolve: () => [],
    },
  }),
};

const PostMutation = {
  postCreateOne: PostTC.getResolver("createOne", [middleware.isAuth]),
  postCreateMany: PostTC.getResolver("createMany", [middleware.isAuth, middleware.isAdmin]),
  postUpdateById: PostTC.getResolver("updateById", [middleware.isAuth]),
  postUpdateOne: PostTC.getResolver("updateOne", [middleware.isAuth, middleware.isAdmin]),
  postUpdateMany: PostTC.getResolver("updateMany", [middleware.isAuth, middleware.isAdmin]),
  postRemoveById: PostTC.getResolver("removeById", [middleware.isAuth]),
  postRemoveOne: PostTC.getResolver("removeOne", [middleware.isAuth, middleware.isAdmin]),
  postRemoveMany: PostTC.getResolver("removeMany", [middleware.isAuth, middleware.isAdmin]),
  postDeleteById: PostTC.getResolver("postDeleteById", [middleware.isAuth]),
  postLikeUnLike: PostTC.getResolver("postLikeUnLike", [middleware.isAuth]),
};

export { PostQuery, PostMutation };
