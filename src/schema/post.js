import { BusinessTC } from "../models/business";
import { PostTC } from "../models/post";

const PostQuery = {
  postById: PostTC.getResolver("findById"),
  postByIds: PostTC.getResolver("findByIds"),
  postOne: PostTC.getResolver("findOne"),
  postMany: PostTC.getResolver("findMany"),
  postCount: PostTC.getResolver("count"),
  postConnection: PostTC.getResolver("connection"),
  postPagination: PostTC.getResolver("pagination"),
  owner: PostTC.addRelation("owner", {
    resolver: () => BusinessTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: { owner: 1 },
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
};

export { PostQuery, PostMutation };
