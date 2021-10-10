import {BusinessTC} from "../../models/business";
import {PostTC} from "../../models/post";

import Resolvers from "./resolvers";
import {authMiddleware as middleware} from "../../middleware/authMiddleware";

for (const resolver in Resolvers) {
  PostTC.addResolver(Resolvers[resolver]);
}

const PostQuery = {
  postById: PostTC.getResolver("findById"),
  postByIds: PostTC.getResolver("findByIds",[middleware.isAuth, middleware.isAdmin]),
  postOne: PostTC.getResolver("findOne"),
  postMany: PostTC.getResolver("findMany"),
  postPagination: PostTC.getResolver("pagination"),
  owner: PostTC.addRelation("owner", {
    resolver: () => BusinessTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: {owner: 1},
  }),
  postIsLiked: PostTC.addFields({
    likeCount: {
      type: 'Int',
      resolve: (post) => post?.likeList ? post.likeList.length : 0,
    },
    isLiked: {
      type: 'Boolean',
      resolve: (post, _, {user}) => post.likeList.indexOf(user?._id) >= 0,
    },
    likeList: {
      type: '[MongoID]',
      resolve: () => []
    }
  }),
};

const PostMutation = {
  postCreateOne: PostTC.getResolver("createOne",[middleware.isAuth, middleware.isAdmin]),
  postCreateMany: PostTC.getResolver("createMany",[middleware.isAuth, middleware.isAdmin]),
  postUpdateById: PostTC.getResolver("updateById",[middleware.isAuth, middleware.isAdmin]),
  postUpdateOne: PostTC.getResolver("updateOne",[middleware.isAuth, middleware.isAdmin]),
  postUpdateMany: PostTC.getResolver("updateMany",[middleware.isAuth, middleware.isAdmin]),
  postRemoveById: PostTC.getResolver("removeById",[middleware.isAuth, middleware.isAdmin]),
  postRemoveOne: PostTC.getResolver("removeOne",[middleware.isAuth, middleware.isAdmin]),
  postRemoveMany: PostTC.getResolver("removeMany",[middleware.isAuth, middleware.isAdmin]),
  postDeleteById: PostTC.getResolver("postDeleteById",[middleware.isAuth, middleware.isAdmin]),
  postLikeUnLike: PostTC.getResolver("postLikeUnLike",[middleware.isAuth, middleware.isAdmin]),
};

export {PostQuery, PostMutation};
