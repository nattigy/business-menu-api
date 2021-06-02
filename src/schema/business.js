import {Business, BusinessTC} from "../models/business";
import {BusinessList} from "../models/businessList";
import {CategoryTC} from "../models/category";
import {User, UserTC} from "../models/user";
import {Post, PostTC} from "../models/post";
import {EventTC} from "../models/event";

BusinessTC.addResolver({
  name: "getBusinesses",
  kind: "query",
  type: BusinessTC.getResolver("findMany").getType(),
  args: {"user_id": "String", limit: "Int", sort: "String"},
  resolve: async ({args}) => {
    let businesses = await Business.find()
      .sort({"subscription": args.sort}).limit(args.limit);
    businesses = businesses.map(e => ({...e._doc, isLiked: e._doc.favoriteList.includes(args.user_id)}));
    return businesses;
  },
});

const BusinessQuery = {
  businessById: BusinessTC.getResolver("findById"),
  businessByIds: BusinessTC.getResolver("findByIds"),
  businessOne: BusinessTC.getResolver("findOne"),
  businessMany: BusinessTC.getResolver("findMany"),
  getBusinesses: BusinessTC.getResolver("getBusinesses"),
  businessCount: BusinessTC.getResolver("count"),
  businessConnection: BusinessTC.getResolver("connection"),
  businessPagination: BusinessTC.getResolver("pagination"),
  businessPosts: BusinessTC.addRelation("posts", {
    resolver: () => PostTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.posts,
    },
    projection: {posts: 1},
  }),
  businessEvents: BusinessTC.addRelation("events", {
    resolver: () => EventTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.events,
    },
    projection: {events: 1},
  }),
  businessCategories: BusinessTC.addRelation("categories", {
    resolver: () => CategoryTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.categories,
    },
    projection: {categories: 1},
  }),
  businessOwner: BusinessTC.addRelation("owner", {
    resolver: () => UserTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: {owner: 1},
  }),
};

BusinessTC.addFields({
  likeCount: {
    type: 'Int',
    resolve: (business) => business ? business.favoriteList ? business.favoriteList.length : 0 : 0,
  },
});

BusinessTC.addResolver({
  name: "businessAddToFavorite",
  kind: "mutation",
  type: BusinessTC,
  args: {user_id: "String", business_id: "String"},
  resolve: async ({args}) => {
    await Business.updateOne(
      {_id: args.business_id},
      {$addToSet: {favoriteList: args.user_id}}
    ).then(async () => {
      await User.updateOne(
        {_id: args.user_id},
        {$addToSet: {favorites: args.business_id}}
      );
    }).catch((error) => error);
    return Business.findById(args.business_id);
  },
});

BusinessTC.addResolver({
  name: "businessRemoveFromFavorite",
  kind: "mutation",
  type: BusinessTC,
  args: {user_id: "String", business_id: "String"},
  resolve: async ({args}) => {
    await Post.updateOne(
      {_id: args.post_id},
      {$pull: {favoriteList: args.user_id}}
    ).then(async () => {
      await User.updateOne(
        {_id: args.user_id},
        {$pull: {favorites: args.business_id}}
      );
    }).catch((error) => error);
    return Business.findById(args.business_id);
  },
});

BusinessTC.addResolver({
  name: "businessCreateOneCustom",
  kind: "mutation",
  type: BusinessTC,
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
    lat: "Float",
  },
  resolve: async ({args}) => {
    let bizId = "";
    await Business.create(
      {
        businessName: args.businessName,
        phoneNumber: args.phoneNumber,
        location: args.location,
        locationDescription: args.locationDescription,
        description: args.description,
        pictures: args.pictures,
        categories: args.categories,
        searchIndex: args.searchIndex,
        lng: args.lng,
        lat: args.lat,
        owner: args.user_id,
      }
    )
      .then(async (res) => {
        bizId = res._id;
        await BusinessList.create(
          {
            autocompleteTerm: args.businessName.toLowerCase()
          }
        )
          .then(async () => {
            await User.updateOne(
              {_id: args.user_id},
              {$addToSet: {businesses: bizId}}
            );
          })
          .catch((error) => error);
      }).catch((error) => error);
    return Business.findById(bizId);
  },
});

const BusinessMutation = {
  businessCreateOne: BusinessTC.getResolver("createOne"),
  businessCreateOneCustom: BusinessTC.getResolver("businessCreateOneCustom"),
  businessCreateMany: BusinessTC.getResolver("createMany"),
  businessUpdateById: BusinessTC.getResolver("updateById"),
  businessAddToFavorite: BusinessTC.getResolver("businessAddToFavorite"),
  businessRemoveFromFavorite: BusinessTC.getResolver("businessRemoveFromFavorite"),
  businessUpdateOne: BusinessTC.getResolver("updateOne"),
  businessUpdateMany: BusinessTC.getResolver("updateMany"),
  businessRemoveById: BusinessTC.getResolver("removeById"),
  businessRemoveOne: BusinessTC.getResolver("removeOne"),
  businessRemoveMany: BusinessTC.getResolver("removeMany"),
};

export {BusinessQuery, BusinessMutation};
