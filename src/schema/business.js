import {Business, BusinessTC} from "../models/business";
import {BusinessList} from "../models/businessList";
import {CategoryTC} from "../models/category";
import {User, UserTC} from "../models/user";
import {PostTC} from "../models/post";
import {EventTC} from "../models/event";
import {Branch, BranchTC} from "../models/branch";
import {Schema} from "mongoose";
import { schemaComposer, toInputObjectType } from 'graphql-compose'

BusinessTC.addResolver({
  name: "getBusinessesLoggedIn",
  kind: "query",
  type: BusinessTC.getResolver("findMany").getType(),
  args: {user_id: "String", limit: "Int", sort: "String"},
  resolve: async ({args}) => {
    let businesses = await Business.find()
      .sort({"subscription": args.sort}).limit(args.limit);
    businesses = businesses.map(e => ({...e._doc, isLiked: e._doc.favoriteList.includes(args.user_id)}));
    return businesses;
  },
});

function calculateDistance({lat, lng, bizLat, bizLng}) {
  return (
    (
      (
        Math.acos(
          Math.sin((lat * Math.PI / 180))
          *
          Math.sin((bizLat * Math.PI / 180)) + Math.cos((lat * Math.PI / 180))
          *
          Math.cos((bizLat * Math.PI / 180)) * Math.cos(((lng - bizLng) * Math.PI / 180)))
      ) * 180 / Math.PI
    ) * 60 * 1.1515 * 1.609344
  );
}

BusinessTC.addResolver({
  name: "businessFilterByLocation",
  kind: "query",
  type: BusinessTC.getResolver("findMany").getType(),
  args: {lat: "Float", lng: "Float", query: "[String]", distance: "Int"},
  resolve: async ({args}) => {
    let businesses = await Business.find({
      searchIndex: {
        $in: args.query
      }
    }).sort({"subscription": "desc"});
    businesses = businesses.filter((biz) => {
      const distance = calculateDistance({lat: args.lat, lng: args.lng, bizLat: biz.lat, bizLng: biz.lng});
      biz.distance = distance;
      return distance <= args.distance && biz;
    });
    return businesses;
  },
});

BusinessTC.addResolver({
  name: "businessFilterByLocationAndFilter",
  kind: "query",
  type: BusinessTC.getResolver("findMany").getType(),
  args: {lat: "Float", lng: "Float", query: "[String]", distance: "Int"},
  resolve: async ({args}) => {
    let businesses = await Business.find({
      searchIndex: {
        $in: args.query
      }
    }).sort({"subscription": "desc"});
    businesses = businesses.filter((biz) => {
      const distance = calculateDistance({lat: args.lat, lng: args.lng, bizLat: biz.lat, bizLng: biz.lng});
      biz.distance = distance;
      return distance <= args.distance && biz;
    });
    businesses = businesses.filter((biz) => {
      const now = new Date();
      const hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
      if(biz.openHours.length > 0){
        const day = biz.openHours[now.getDay()-1];
        const opens = parseInt(day.opens.split(":")[0]) <= hour;
        const closes = parseInt(day.closes.split(":")[0])+6 >= hour;
        return day.isOpen && opens && closes && biz;
      }
      return [];
    });
    return businesses;
  },
});

BusinessTC.addResolver({
  name: "businessFilterByFilter",
  kind: "query",
  type: BusinessTC.getResolver("findMany").getType(),
  args: {query: "[String]"},
  resolve: async ({args}) => {
    let businesses = await Business.find({
      searchIndex: {
        $in: args.query
      }
    }).sort({"subscription": "desc"});
    businesses = businesses.filter((biz) => {
      const now = new Date();
      const hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
      if(biz.openHours.length > 0){
        const day = biz.openHours[now.getDay()-1];
        const opens = parseInt(day.opens.split(":")[0]) <= hour;
        const closes = parseInt(day.closes.split(":")[0])+6 >= hour;
        return day.isOpen && opens && closes && biz;
      }
      return [];
    });
    return businesses;
  },
});

BusinessTC.addResolver({
  name: "businessByIdLoggedIn",
  kind: "query",
  type: BusinessTC.getResolver("findById").getType(),
  args: {user_id: "String", business_id: "String"},
  resolve: async ({args}) => {
    let business = await Business.find({
      _id: args.business_id
    });
    business = {...business[0]._doc, isLiked: business[0]._doc.favoriteList.includes(args.user_id)};
    return business;
  },
});

const BusinessQuery = {
  businessById: BusinessTC.getResolver("findById"),
  businessByIds: BusinessTC.getResolver("findByIds"),
  businessOne: BusinessTC.getResolver("findOne"),
  businessMany: BusinessTC.getResolver("findMany"),
  getBusinessesLoggedIn: BusinessTC.getResolver("getBusinessesLoggedIn"),
  businessByIdLoggedIn: BusinessTC.getResolver("businessByIdLoggedIn"),
  businessFilterByLocation: BusinessTC.getResolver("businessFilterByLocation"),
  businessFilterByFilter: BusinessTC.getResolver("businessFilterByFilter"),
  businessFilterByLocationAndFilter: BusinessTC.getResolver("businessFilterByLocationAndFilter"),
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
  branches: BusinessTC.addRelation("branches", {
    resolver: () => BranchTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.branches,
    },
    projection: {branches: 1},
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
    await Business.updateOne(
      {_id: args.business_id},
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
  name: "businessCreateOneCustomAdmin",
  kind: "mutation",
  type: BusinessTC,
  args: {
    user_id: "String",
    businessName: "String",
    phoneNumber: "String",
    location: "String",
    locationDescription: "String",
    pictures: ["String"],
    categories: ["String"],
    searchIndex: ["String"],
    categoryIndex: ["String"],
    claimed: "Boolean",
    lng: "Float",
    lat: "Float",
  },
  resolve: async ({args}) => {
    let bizId = "";
    await Business.create(
      {
        businessName: args.businessName,
        phoneNumber: args.phoneNumber,
        claimed: args.claimed,
        location: args.location,
        locationDescription: args.locationDescription,
        pictures: args.pictures,
        categories: args.categories,
        searchIndex: args.searchIndex,
        categoryIndex: args.categoryIndex,
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
        await Branch.create({
          branchName: args.businessName,
          phoneNumber: args.phoneNumber,
          location: args.location,
          locationDescription: args.locationDescription,
          lng: args.lng,
          lat: args.lat,
          state: "ACTIVE",
          pictures: args.pictures,
          owner: bizId
        }).then(async (bb) => {
          await Business.findByIdAndUpdate(bizId, {
            branches: [bb._id]
          });
        }).catch((error) => error);
      }).catch((error) => error);
    return Business.findById(bizId);
  },
});

const InputTC = schemaComposer.createObjectTC({
  name: 'businessCreateManyCustomInput',
  fields: {
    user_id: "String",
    businessName: "String",
    phoneNumber: "String",
    location: "String",
    locationDescription: "String",
    pictures: ["String"],
    categories: ["String"],
    searchIndex: ["String"],
    categoryIndex: ["String"],
    claimed: "Boolean",
    lng: "Float",
    lat: "Float",
  }
});

const InputITC = toInputObjectType(InputTC);

BusinessTC.addResolver({
  name: "businessCreateManyCustom",
  kind: "mutation",
  type: BusinessTC,
  args: {
    businesses: [InputITC]
  },
  resolve: async ({args}) => {
    for (let i = 0; i < args.businesses.length; i ++){
      let bizId = "";
      await Business.create(
        {
          businessName: args.businesses[i].businessName,
          phoneNumber: args.businesses[i].phoneNumber,
          claimed: args.businesses[i].claimed,
          location: args.businesses[i].location,
          locationDescription: args.businesses[i].locationDescription,
          pictures: args.businesses[i].pictures,
          categories: args.businesses[i].categories,
          searchIndex: args.businesses[i].searchIndex,
          categoryIndex: args.businesses[i].categoryIndex,
          lng: args.businesses[i].lng,
          lat: args.businesses[i].lat,
          owner: args.businesses[i].user_id,
        }
      )
        .then(async (res) => {
          bizId = res._id;
          await BusinessList.create(
            {
              autocompleteTerm: args.businesses[i].businessName.toLowerCase()
            }
          )
            .then(async () => {
              await User.updateOne(
                {_id: args.businesses[i].user_id},
                {$addToSet: {businesses: bizId}}
              );
            })
            .catch((error) => error);
          await Branch.create({
            branchName: args.businesses[i].businessName,
            phoneNumber: args.businesses[i].phoneNumber,
            location: args.businesses[i].location,
            locationDescription: args.businesses[i].locationDescription,
            lng: args.businesses[i].lng,
            lat: args.businesses[i].lat,
            state: "ACTIVE",
            pictures: args.businesses[i].pictures,
            owner: bizId
          }).then(async (bb) => {
            await Business.findByIdAndUpdate(bizId, {
              branches: [bb._id]
            });
          }).catch((error) => error);
        }).catch((error) => error);
    }
    // return Business.findByIds(bizId);
  },
});

const BusinessMutation = {
  businessCreateOne: BusinessTC.getResolver("createOne"),
  businessCreateOneCustomAdmin: BusinessTC.getResolver("businessCreateOneCustomAdmin"),
  businessCreateMany: BusinessTC.getResolver("createMany"),
  businessCreateManyCustom: BusinessTC.getResolver("businessCreateManyCustom"),
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
