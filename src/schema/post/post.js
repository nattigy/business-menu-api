import {BusinessTC} from "../../models/business";
import {PostTC} from "../../models/post";

import Resolvers from "./resolvers";

for (const resolver in Resolvers) {
  PostTC.addResolver(Resolvers[resolver]);
}

const PostQuery = {
  postById: PostTC.getResolver("findById"),
  postByIds: PostTC.getResolver("findByIds"),
  postOne: PostTC.getResolver("findOne"),
  postMany: PostTC.getResolver("findMany"),
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
      resolve: (source, _, context) => {
        // get user id => context.req.headers.authorization
        return false;
      },
    },
    likeList: {
      type: '[MongoID]',
      resolve: () => []
    }
  }),
};

const PostMutation = {
  postCreateOne: PostTC.getResolver("createOne"),
  postCreateMany: PostTC.getResolver("createMany"),
  postUpdateById: PostTC.getResolver("updateById"),
  postUpdateOne: PostTC.getResolver("updateOne"),
  postUpdateMany: PostTC.getResolver("updateMany"),
  postRemoveById: PostTC.getResolver("removeById"),
  postRemoveOne: PostTC.getResolver("removeOne"),
  postRemoveMany: PostTC.getResolver("removeMany"),
  postDeleteById: PostTC.getResolver("postDeleteById"),
  postLikeUnLike: PostTC.getResolver("postLikeUnLike"),
};

export {PostQuery, PostMutation};
