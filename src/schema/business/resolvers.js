import {schemaComposer, toInputObjectType} from "graphql-compose";

import {BusinessModel, BusinessTC} from "../../models/business";
import {UserModel} from "../../models/user";
import {BusinessList} from "../../models/businessList";
import {EventModel} from "../../models/event";
import {PostModel} from "../../models/post";

const getBusinessesLoggedIn = {
  name: "getBusinessesLoggedIn",
  kind: "query",
  type: BusinessTC.getResolver("findMany").getType(),
  args: {user_id: "String", limit: "Int", sort: "String"},
  resolve: async ({args}) => {
    let businesses = await BusinessModel.find()
      .sort({"subscription": args.sort}).limit(args.limit);
    businesses = businesses.map(e => ({...e._doc, isLiked: e._doc.favoriteList.includes(args.user_id)}));
    return businesses;
  },
};

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

const businessFilterByLocation = {
  name: "businessFilterByLocation",
  kind: "query",
  type: BusinessTC.getResolver("findMany").getType(),
  args: {lat: "Float", lng: "Float", query: "[String]", distance: "Int"},
  resolve: async ({args}) => {
    let businesses = await BusinessModel.find({
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
};

const businessFilterByLocationAndFilter = {
  name: "businessFilterByLocationAndFilter",
  kind: "query",
  type: BusinessTC.getResolver("findMany").getType(),
  args: {lat: "Float", lng: "Float", query: "[String]", distance: "Int"},
  resolve: async ({args}) => {
    let businesses = await BusinessModel.find({
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
};

const businessFilterByFilter = {
  name: "businessFilterByFilter",
  kind: "query",
  type: BusinessTC.getResolver("findMany").getType(),
  args: {query: "[String]"},
  resolve: async ({args}) => {
    let businesses = await BusinessModel.find({
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
}

const businessByIdLoggedIn = {
  name: "businessByIdLoggedIn",
  kind: "query",
  type: BusinessTC.getResolver("findById").getType(),
  args: {user_id: "String", business_id: "String"},
  resolve: async ({args}) => {
    let business = await BusinessModel.find({
      _id: args.business_id
    });
    business = {...business[0]._doc, isLiked: business[0]._doc.favoriteList.includes(args.user_id)};
    return business;
  },
};

const businessAddToFavorite = {
  name: "businessAddToFavorite",
  kind: "mutation",
  type: BusinessTC,
  args: {user_id: "String", business_id: "String"},
  resolve: async ({args}) => {
    await BusinessModel.updateOne(
      {_id: args.business_id},
      {$addToSet: {favoriteList: args.user_id}}
    ).then(async () => {
      await UserModel.updateOne(
        {_id: args.user_id},
        {$addToSet: {favorites: args.business_id}}
      );
    }).catch((error) => error);
    return BusinessModel.findById(args.business_id);
  },
};

const businessRemoveFromFavorite = {
  name: "businessRemoveFromFavorite",
  kind: "mutation",
  type: BusinessTC,
  args: {user_id: "String", business_id: "String"},
  resolve: async ({args}) => {
    await BusinessModel.updateOne(
      {_id: args.business_id},
      {$pull: {favoriteList: args.user_id}}
    ).then(async () => {
      await UserModel.updateOne(
        {_id: args.user_id},
        {$pull: {favorites: args.business_id}}
      );
    }).catch((error) => error);
    return BusinessModel.findById(args.business_id);
  },
};

const businessCreateOneCustomAdmin = {
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
    await BusinessModel.create(
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
        branches: [
          {
            phoneNumber: args.phoneNumber,
            location: args.location,
            locationDescription: args.locationDescription,
            lng: args.lng,
            lat: args.lat,
            pictures: args.pictures[0],
          }
        ]
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
            await UserModel.updateOne(
              {_id: args.user_id},
              {$addToSet: {businesses: bizId}}
            );
          })
          .catch((error) => error);
      }).catch((error) => error);
    return BusinessModel.findById(bizId);
  },
};

const InputTC = schemaComposer.createObjectTC({
  name: 'BusinessCreateManyCustomInput',
  fields: {
    user_id: "String",
    businessName: "String",
    phoneNumber: ["String"],
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

const BusinessCreateManyCustomInput = toInputObjectType(InputTC);

const businessCreateManyCustom = {
  name: "businessCreateManyCustom",
    kind: "mutation",
    type: BusinessTC,
    args: {
    businesses: [BusinessCreateManyCustomInput]
  },
  resolve: async ({args}) => {
    for (let i = 0; i < args.businesses.length; i ++){
      let bizId = "";
      await BusinessModel.create(
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
          branches: [
            {
              phoneNumber: args.businesses[i].phoneNumber,
              location: args.businesses[i].location,
              locationDescription: args.businesses[i].locationDescription,
              lng: args.businesses[i].lng,
              lat: args.businesses[i].lat,
              pictures: args.businesses[i].pictures[0],
            }
          ]
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
              await UserModel.updateOne(
                {_id: args.businesses[i].user_id},
                {$addToSet: {businesses: bizId}}
              );
            })
            .catch((error) => error);
        }).catch((error) => error);
    }
    // return BusinessModel.findByIds(bizId);
  },
};

const removeByIdCustom = {
  name: "removeByIdCustom",
  kind: "mutation",
  type: BusinessTC,
  args: {
    id: "String"
  },
  resolve: async ({args}) => {
    const business = await BusinessModel.findById(args.id);
    await BusinessModel.findByIdAndDelete(args.id);
    for (let i = 0; i < business.events.length; i++){
      await EventModel.findByIdAndDelete(business.events[i]);
    }
    for (let i = 0; i < business.posts.length; i++){
      await PostModel.findByIdAndDelete(business.posts[i]);
    }
    for (let i = 0; i < business.branches.length; i++){
      await PostModel.findByIdAndDelete(business.branches[i]);
    }
    await UserModel.findByIdAndUpdate(business.owner, {
      $pull: {businesses: args.id}
    });
  },
};

export default {
  getBusinessesLoggedIn,
  businessFilterByLocation,
  businessFilterByLocationAndFilter,
  businessFilterByFilter,
  businessByIdLoggedIn,
  businessAddToFavorite,
  businessRemoveFromFavorite,
  businessCreateOneCustomAdmin,
  businessCreateManyCustom,
  removeByIdCustom,
};
