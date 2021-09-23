import {BusinessTC} from "../../models/business";
import {PostModel, PostTC} from "../../models/post";

import Resolvers from "./resolvers";
import {authMiddleware as middleware} from "../../middleware/authMiddleware";

for (const resolver in Resolvers) {
  PostTC.addResolver(Resolvers[resolver]);
}

const PostQuery = {
  postById: PostTC.getResolver("findById",[middleware.isAuth, middleware.isAdmin]),
  postByIds: PostTC.getResolver("findByIds",[middleware.isAuth, middleware.isAdmin]),
  postOne: PostTC.getResolver("findOne",[middleware.isAuth, middleware.isAdmin]),
  postMany: PostTC.getResolver("findMany",[middleware.isAuth, middleware.isAdmin]),
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
      resolve: (post) => post ? post.likeList ? post.likeList.length : 0 : 0,
    },
    isLiked: {
      type: 'Boolean',
      resolve: (post, _, {user}) => {
        const po = PostModel.findById(post._id,{likeList: 1});
        return po.likeList.contains(user._id);
      },
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
