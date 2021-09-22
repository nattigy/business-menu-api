import {PostModel, PostTC} from "../../models/post";
import {UserModel} from "../../models/user";
import {BusinessModel} from "../../models/business";

const postLikeUnLike = {
  name: "postLikeUnLike",
  kind: "mutation",
  type: PostTC,
  args: {user_id: "String", post_id: "String"},
  resolve: async ({args: {user_id, post_id}}) => {
    const {likeList} = await PostModel.findById(
      post_id, {likeList: 1},
    );

    if (likeList.contains(user_id)) {
      await PostModel.updateOne(
        {_id: post_id},
        {$pull: {likeList: user_id}}
      ).then(async () => {
        await UserModel.updateOne(
          {_id: user_id},
          {$pull: {likedPosts: post_id}}
        );
      }).catch((error) => error);
    } else {
      await PostModel.updateOne(
        {_id: post_id},
        {$addToSet: {likeList: user_id}}
      ).then(async () => {
        await UserModel.updateOne(
          {_id: user_id},
          {$addToSet: {likedPosts: post_id}}
        );
      }).catch((error) => error);
    }
    return PostModel.findById(post_id);
  },
};

const postDeleteById = {
  name: "postDeleteById",
  kind: "mutation",
  type: PostTC.getResolver("removeById"),
  args: {post_id: "String", owner: "String"},
  resolve: async ({args: {post_id, owner}}) => {
    await PostModel.remove(
      {_id: post_id},
      async () => {
        await BusinessModel.updateOne(
          {_id: owner},
          {$pull: {posts: post_id}}
        );
      }
    ).catch((error) => error);
    return post_id;
  },
};

export default {postLikeUnLike, postDeleteById};
