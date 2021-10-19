import {PostModel, PostTC} from "../../models/post";
import {UserModel} from "../../models/user";
import {BusinessModel} from "../../models/business";
import {userService} from "../../utils/userService";

const postLikeUnLike = {
  name: "postLikeUnLike",
  kind: "mutation",
  type: PostTC,
  args: {postId: "String"},
  resolve: async ({args: {postId}, context: {accessToken}}) => {
    const user = await userService.getUser(accessToken.replace("Bearer ", ""));
    const userId = user._id;
    const {likeList} = await PostModel.findById(
      postId, {likeList: 1},
    );

    if (likeList.indexOf(userId) >= 0) {
      await PostModel.updateOne(
        {_id: postId},
        {$pull: {likeList: userId}}
      ).then(async () => {
        await UserModel.updateOne(
          {_id: userId},
          {$pull: {likedPosts: postId}}
        );
      }).catch((error) => error);
    } else {
      await PostModel.updateOne(
        {_id: postId},
        {$addToSet: {likeList: userId}}
      ).then(async () => {
        await UserModel.updateOne(
          {_id: userId},
          {$addToSet: {likedPosts: postId}}
        );
      }).catch((error) => error);
    }
    return PostModel.findById(postId);
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
