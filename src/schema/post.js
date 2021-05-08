import {BusinessTC} from "../models/business";
import {PostTC, Post} from "../models/post";
import {User} from "../models/user";

PostTC.addResolver({
    name: "getPosts",
    kind: "query",
    type: PostTC.getResolver("findMany").getType(),
    args: {"user_id": "String", limit: "Int", fromDate: "String", sort: "String"},
    resolve: async ({args}) => {
        let posts = await Post.find({
            "createdAt": {$gte: args.fromDate}
        })
            .sort({"createdAt": args.sort}).limit(args.limit);
        posts = posts.map(e => ({...e._doc, isLiked: e._doc.likeList.includes(args.user_id)}));
        return posts;
    },
});

const PostQuery = {
    postById: PostTC.getResolver("findById"),
    postByIds: PostTC.getResolver("findByIds"),
    postOne: PostTC.getResolver("findOne"),
    postMany: PostTC.getResolver("findMany"),
    getPosts: PostTC.getResolver("getPosts"),
    postCount: PostTC.getResolver("count"),
    postConnection: PostTC.getResolver("connection"),
    postPagination: PostTC.getResolver("pagination"),
    owner: PostTC.addRelation("owner", {
        resolver: () => BusinessTC.getResolver("findById"),
        prepareArgs: {
            _id: (source) => source.owner,
        },
        projection: {owner: 1},
    }),
};

PostTC.addFields({
    likeCount: {
        type: 'Int',
        resolve: (post) => post ? post.likeList ? post.likeList.length : 0 : 0,
    },
});

PostTC.addResolver({
    name: "postLike",
    kind: "mutation",
    type: PostTC,
    args: {"user_id": "String", post_id: "String"},
    resolve: async ({args}) => {
        await Post.updateOne(
            {_id: args.post_id},
            {$addToSet: {likeList: args.user_id}}
        ).then(async () => {
            await User.updateOne(
                {_id: args.user_id},
                {$addToSet: {likedPosts: args.post_id}}
            );
        }).catch((error) => error);
        return Post.findById(args.post_id);
    },
});

PostTC.addResolver({
    name: "postUnlike",
    kind: "mutation",
    type: PostTC,
    args: {"user_id": "String", post_id: "String"},
    resolve: async ({args}) => {
        await Post.updateOne(
            {_id: args.post_id},
            {$pull: {likeList: args.user_id}}
        ).then(async () => {
            await User.updateOne(
                {_id: args.user_id},
                {$pull: {likedPosts: args.post_id}}
            );
        }).catch((error) => error);
        return Post.findById(args.post_id);
    },
});

const PostMutation = {
    postCreateOne: PostTC.getResolver("createOne"),
    postCreateMany: PostTC.getResolver("createMany"),
    postUpdateById: PostTC.getResolver("updateById"),
    postLike: PostTC.getResolver("postLike"),
    postUnlike: PostTC.getResolver("postUnlike"),
    postUpdateOne: PostTC.getResolver("updateOne"),
    postUpdateMany: PostTC.getResolver("updateMany"),
    postRemoveById: PostTC.getResolver("removeById"),
    postRemoveOne: PostTC.getResolver("removeOne"),
    postRemoveMany: PostTC.getResolver("removeMany"),
};

export {PostQuery, PostMutation};
