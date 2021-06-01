"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BusinessMutation = exports.BusinessQuery = undefined;

var _business = require("../models/business");

var _businessList = require("../models/businessList");

var _category = require("../models/category");

var _user = require("../models/user");

var _post = require("../models/post");

var _event = require("../models/event");

_business.BusinessTC.addResolver({
  name: "getBusinesses",
  kind: "query",
  type: _business.BusinessTC.getResolver("findMany").getType(),
  args: {
    "user_id": "String",
    limit: "Int",
    sort: "String"
  },
  resolve: async ({
    args
  }) => {
    let businesses = await _business.Business.find().sort({
      "subscription": args.sort
    }).limit(args.limit);
    businesses = businesses.map(e => ({ ...e._doc,
      isLiked: e._doc.favoriteList.includes(args.user_id)
    }));
    return businesses;
  }
});

const BusinessQuery = {
  businessById: _business.BusinessTC.getResolver("findById"),
  businessByIds: _business.BusinessTC.getResolver("findByIds"),
  businessOne: _business.BusinessTC.getResolver("findOne"),
  businessMany: _business.BusinessTC.getResolver("findMany"),
  getBusinesses: _business.BusinessTC.getResolver("getBusinesses"),
  businessCount: _business.BusinessTC.getResolver("count"),
  businessConnection: _business.BusinessTC.getResolver("connection"),
  businessPagination: _business.BusinessTC.getResolver("pagination"),
  businessPosts: _business.BusinessTC.addRelation("posts", {
    resolver: () => _post.PostTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: source => source.posts
    },
    projection: {
      posts: 1
    }
  }),
  businessEvents: _business.BusinessTC.addRelation("events", {
    resolver: () => _event.EventTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: source => source.events
    },
    projection: {
      events: 1
    }
  }),
  businessCategories: _business.BusinessTC.addRelation("categories", {
    resolver: () => _category.CategoryTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: source => source.categories
    },
    projection: {
      categories: 1
    }
  }),
  businessOwner: _business.BusinessTC.addRelation("owner", {
    resolver: () => _user.UserTC.getResolver("findById"),
    prepareArgs: {
      _id: source => source.owner
    },
    projection: {
      owner: 1
    }
  })
};

_business.BusinessTC.addFields({
  likeCount: {
    type: 'Int',
    resolve: business => business ? business.favoriteList ? business.favoriteList.length : 0 : 0
  }
});

_business.BusinessTC.addResolver({
  name: "addToFavorite",
  kind: "mutation",
  type: _business.BusinessTC,
  args: {
    user_id: "String",
    business_id: "String"
  },
  resolve: async ({
    args
  }) => {
    await _business.Business.updateOne({
      _id: args.business_id
    }, {
      $addToSet: {
        favoriteList: args.user_id
      }
    }).then(async () => {
      await _user.User.updateOne({
        _id: args.user_id
      }, {
        $addToSet: {
          favorites: args.business_id
        }
      });
    }).catch(error => error);
    return _business.Business.findById(args.business_id);
  }
});

_business.BusinessTC.addResolver({
  name: "removeFromFavorite",
  kind: "mutation",
  type: _business.BusinessTC,
  args: {
    user_id: "String",
    business_id: "String"
  },
  resolve: async ({
    args
  }) => {
    await _post.Post.updateOne({
      _id: args.post_id
    }, {
      $pull: {
        favoriteList: args.user_id
      }
    }).then(async () => {
      await _user.User.updateOne({
        _id: args.user_id
      }, {
        $pull: {
          favorites: args.business_id
        }
      });
    }).catch(error => error);
    return _business.Business.findById(args.business_id);
  }
});

_business.BusinessTC.addResolver({
  name: "businessCreateOneCustom",
  kind: "mutation",
  type: _business.BusinessTC,
  args: {
    user_id: "String",
    businessName: "String",
    phoneNumber: "String",
    location: "String",
    locationDescription: "String",
    description: "String",
    pictures: ["String"],
    categories: ["String"],
    searchIndex: ["String"],
    lng: "Float",
    lat: "Float"
  },
  resolve: async ({
    args
  }) => {
    let bizId = "";
    await _business.Business.create({
      businessName: args.businessName,
      phoneNumber: args.phoneNumber,
      location: args.location,
      locationDescription: args.locationDescription,
      description: args.description,
      pictures: args.pictures,
      categories: args.categories,
      searchIndex: args.searchIndex,
      lng: args.lng,
      lat: args.lat
    }).then(async res => {
      bizId = res._id;
      await _businessList.BusinessList.create({
        autocompleteTerm: args.businessName.toLowerCase()
      }).then(async () => {
        await _user.User.updateOne({
          _id: args.user_id
        }, {
          $addToSet: {
            businesses: bizId
          }
        });
      }).catch(error => error);
    }).catch(error => error);
    return _business.Business.findById(bizId);
  }
});

const BusinessMutation = {
  businessCreateOne: _business.BusinessTC.getResolver("createOne"),
  businessCreateOneCustom: _business.BusinessTC.getResolver("businessCreateOneCustom"),
  businessCreateMany: _business.BusinessTC.getResolver("createMany"),
  businessUpdateById: _business.BusinessTC.getResolver("updateById"),
  addToFavorite: _business.BusinessTC.getResolver("addToFavorite"),
  removeFromFavorite: _business.BusinessTC.getResolver("removeFromFavorite"),
  businessUpdateOne: _business.BusinessTC.getResolver("updateOne"),
  businessUpdateMany: _business.BusinessTC.getResolver("updateMany"),
  businessRemoveById: _business.BusinessTC.getResolver("removeById"),
  businessRemoveOne: _business.BusinessTC.getResolver("removeOne"),
  businessRemoveMany: _business.BusinessTC.getResolver("removeMany")
};
exports.BusinessQuery = BusinessQuery;
exports.BusinessMutation = BusinessMutation;