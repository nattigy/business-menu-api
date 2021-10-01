import {schemaComposer, toInputObjectType} from "graphql-compose";
import mongoose from "mongoose";

import {BusinessModel, BusinessTC} from "../../models/business";
import {UserModel} from "../../models/user";
import {BusinessListModel} from "../../models/businessList";
import {EventModel} from "../../models/event";
import {PostModel} from "../../models/post";
import {calculateDistance} from "../../utils/utils";

// Queries

const getBusinessesByFilter = {
  name: "getBusinessesByFilter",
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

// Mutations

const businessLikeUnLike = {
  name: "businessLikeUnLike",
  kind: "mutation",
  type: BusinessTC,
  args: {businessId: "String!"},
  resolve: async ({args: {businessId}, context: {user}}) => {
    const userId = user._id;
    const {favoriteList} = await BusinessModel.findById(
      businessId, {favoriteList: 1},
    );

    if (favoriteList.contains(userId)) {
      await BusinessModel.updateOne(
        {_id: businessId},
        {$pull: {favoriteList: userId}}
      ).then(async () => {
        await UserModel.updateOne(
          {_id: userId},
          {$pull: {favorites: businessId}}
        );
      }).catch((error) => error);
    } else {
      await BusinessModel.updateOne(
        {_id: businessId},
        {$addToSet: {favoriteList: userId}}
      ).then(async () => {
        await UserModel.updateOne(
          {_id: userId},
          {$addToSet: {favorites: businessId}}
        );
      }).catch((error) => error);
    }
    return BusinessModel.findById(businessId);
  },
};

const businessCreateOneCustomAdmin = {
  name: "businessCreateOneCustomAdmin",
  kind: "mutation",
  type: BusinessTC,
  args: {
    businessName: "String!",
    phoneNumbers: "String!",
    location: "String!",
    locationDescription: "String",
    pictures: ["String!"],
    categories: ["String!"],
    searchIndex: ["String!"],
    categoryIndex: ["String"],
    claimed: "Boolean!",
    lng: "Float!",
    lat: "Float!",
  },
  resolve: async ({args: {
    businessName,
    phoneNumbers,
    claimed,
    location,
    locationDescription,
    pictures,
    categories,
    searchIndex,
    categoryIndex,
    lng,
    lat,
  }, context: {user}}) => {
    let bizId = "";
    await BusinessModel.create(
      {
        businessName,
        phoneNumbers,
        claimed,
        location,
        locationDescription,
        pictures,
        categories,
        searchIndex,
        categoryIndex,
        lng,
        lat,
        owner: user._id,
        branches: [
          {
            phoneNumbers,
            location,
            locationDescription,
            lng,
            lat,
            pictures: pictures[0],
          }
        ]
      }
    )
      .then(async (res) => {
        bizId = res._id;
        await BusinessListModel.create(
          {
            autocompleteTerm: businessName.toLowerCase()
          }
        )
          .then(async () => {
            await UserModel.updateOne(
              {_id: user._id},
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
    businessName: "String!",
    phoneNumbers: ["String!"],
    location: "String!",
    locationDescription: "String!",
    pictures: ["String!"],
    categories: ["String!"],
    searchIndex: ["String!"],
    categoryIndex: ["String!"],
    claimed: "Boolean!",
    lng: "Float!",
    lat: "Float!",
  }
});

const BusinessCreateManyCustomInput = toInputObjectType(InputTC);

const businessCreateManyCustom = {
  name: "businessCreateManyCustom",
  kind: "mutation",
  type: BusinessTC.getResolver("createMany"),
  args: {
    businesses: [BusinessCreateManyCustomInput]
  },
  resolve: async ({args: {businesses}, context: {user}}) => {
    const bizIds = [];
    for (let i = 0; i < businesses.length; i++) {
      let bizId = "";
      await BusinessModel.create(
        {
          businessName: businesses[i].businessName,
          phoneNumbers: businesses[i].phoneNumbers,
          claimed: businesses[i].claimed,
          location: businesses[i].location,
          locationDescription: businesses[i].locationDescription,
          pictures: businesses[i].pictures,
          categories: businesses[i].categories,
          searchIndex: businesses[i].searchIndex,
          categoryIndex: businesses[i].categoryIndex,
          lng: businesses[i].lng,
          lat: businesses[i].lat,
          owner: user._id,
          branches: [
            {
              phoneNumbers: businesses[i].phoneNumbers,
              location: businesses[i].location,
              locationDescription: businesses[i].locationDescription,
              lng: businesses[i].lng,
              lat: businesses[i].lat,
              pictures: businesses[i].pictures[0],
            }
          ]
        }
      )
        .then(async (res) => {
          bizId = res._id;
          bizIds.push(bizId);
          await BusinessListModel.create(
            {
              autocompleteTerm: businesses[i].businessName.toLowerCase()
            }
          )
            .then(async () => {
              await UserModel.updateOne(
                {_id: user._id},
                {$addToSet: {businesses: bizId}}
              );
            })
            .catch((error) => error);
        }).catch((error) => error);
    }
    return BusinessModel.find({
      _id: {
        $in: [...bizIds.map(e => mongoose.Types.ObjectId(e))]
      }
    });
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
    for (let i = 0; i < business.events.length; i++) {
      await EventModel.findByIdAndDelete(business.events[i]);
    }
    for (let i = 0; i < business.posts.length; i++) {
      await PostModel.findByIdAndDelete(business.posts[i]);
    }
    for (let i = 0; i < business.branches.length; i++) {
      await PostModel.findByIdAndDelete(business.branches[i]);
    }
    await UserModel.findByIdAndUpdate(business.owner, {
      $pull: {businesses: args.id}
    });
  },
};

export default {
  getBusinessesByFilter,
  businessLikeUnLike,
  businessCreateOneCustomAdmin,
  businessCreateManyCustom,
  removeByIdCustom,
};
