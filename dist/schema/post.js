"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostMutation = exports.PostQuery = undefined;

var _business = require("../models/business");

var _post = require("../models/post");

var _user = require("../models/user");

_post.PostTC.addResolver({
  name: "getPostLoggedIn",
  kind: "query",
  type: _post.PostTC.getResolver("findMany").getType(),
  args: {
    "user_id": "String",
    limit: "Int",
    fromDate: "String",
    sort: "String"
  },
  resolve: async ({
    args
  }) => {
    let posts = await _post.Post.find({
      "createdAt": {
        $gte: args.fromDate
      }
    }).sort({
      "createdAt": args.sort
    }).limit(args.limit);
    posts = posts.map(e => ({ ...e._doc,
      isLiked: e._doc.likeList.includes(args.user_id)
    }));
    return posts;
  }
});

const PostQuery = {
  postById: _post.PostTC.getResolver("findById"),
  postByIds: _post.PostTC.getResolver("findByIds"),
  postOne: _post.PostTC.getResolver("findOne"),
  postMany: _post.PostTC.getResolver("findMany"),
  getPostLoggedIn: _post.PostTC.getResolver("getPostLoggedIn"),
  postCount: _post.PostTC.getResolver("count"),
  postConnection: _post.PostTC.getResolver("connection"),
  postPagination: _post.PostTC.getResolver("pagination"),
  likeList: _post.PostTC.addRelation("likeList", {
    resolver: () => _user.UserTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: source => source.likeList
    },
    projection: {
      likeList: 1
    }
  }),
  owner: _post.PostTC.addRelation("owner", {
    resolver: () => _business.BusinessTC.getResolver("findById"),
    prepareArgs: {
      _id: source => source.owner
    },
    projection: {
      owner: 1
    }
  })
};

_post.PostTC.addFields({
  likeCount: {
    type: 'Int',
    resolve: post => post ? post.likeList ? post.likeList.length : 0 : 0
  }
});

_post.PostTC.addResolver({
  name: "postLike",
  kind: "mutation",
  type: _post.PostTC,
  args: {
    "user_id": "String",
    post_id: "String"
  },
  resolve: async ({
    args
  }) => {
    await _post.Post.updateOne({
      _id: args.post_id
    }, {
      $addToSet: {
        likeList: args.user_id
      }
    }).then(async () => {
      await _user.User.updateOne({
        _id: args.user_id
      }, {
        $addToSet: {
          likedPosts: args.post_id
        }
      });
    }).catch(error => error);
    return _post.Post.findById(args.post_id);
  }
});

_post.PostTC.addResolver({
  name: "postUnlike",
  kind: "mutation",
  type: _post.PostTC,
  args: {
    "user_id": "String",
    post_id: "String"
  },
  resolve: async ({
    args
  }) => {
    await _post.Post.updateOne({
      _id: args.post_id
    }, {
      $pull: {
        likeList: args.user_id
      }
    }).then(async () => {
      await _user.User.updateOne({
        _id: args.user_id
      }, {
        $pull: {
          likedPosts: args.post_id
        }
      });
    }).catch(error => error);
    return _post.Post.findById(args.post_id);
  }
});

const PostMutation = {
  postCreateOne: _post.PostTC.getResolver("createOne"),
  postCreateMany: _post.PostTC.getResolver("createMany"),
  postUpdateById: _post.PostTC.getResolver("updateById"),
  postLike: _post.PostTC.getResolver("postLike"),
  postUnlike: _post.PostTC.getResolver("postUnlike"),
  postUpdateOne: _post.PostTC.getResolver("updateOne"),
  postUpdateMany: _post.PostTC.getResolver("updateMany"),
  postRemoveById: _post.PostTC.getResolver("removeById"),
  postRemoveOne: _post.PostTC.getResolver("removeOne"),
  postRemoveMany: _post.PostTC.getResolver("removeMany")
};
exports.PostQuery = PostQuery;
exports.PostMutation = PostMutation;