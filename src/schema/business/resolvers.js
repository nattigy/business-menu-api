import mongoose from "mongoose";

import {BusinessModel, BusinessTC} from "../../models/business";
import {UserModel} from "../../models/user";
import {BusinessListModel} from "../../models/businessList";
import {EventModel} from "../../models/event";
import {PostModel} from "../../models/post";
import {BusinessCreateBranchInput, BusinessCreateManyCustomInput} from "./input-types";

// Queries

const getBusinessesByFilter = {
  name: "getBusinessesByFilter",
  kind: "query",
  type: "Pagination",
  args: {
    category: "[String]",
    query: "[String]",
    distance: "Int",
    openNow: "Boolean",
    page: "Int!",
    perPage: "Int!",
    lat: "Float",
    lng: "Float",
  },
  resolve: async ({args: {category, query, distance, openNow, page, perPage, lat, lng}}) => {
    let geoNear = {};
    const pipeline = [];
    if (distance > 0) {
      geoNear = {
        $geoNear: {
          near: {type: "Point", coordinates: [lng, lat]},
          distanceField: "distance",
          maxDistance: distance,
          includeLocs: "lngLat",
          distanceMultiplier: 0.001,
          spherical: true
        }
      };
      pipeline.push(geoNear);
    }
    if (category !== []) {
      pipeline.push({$match: {searchIndex: {$in: category}}});
    }
    if (query !== []) {
      pipeline.push({$match: {searchIndex: {$in: query}}});
    }
    if (openNow) {
      pipeline.push({$match: {openHours: {$elemMatch: {day: "Monday"}}}});
      pipeline.push({$match: {openHours: {$elemMatch: {opens: {$gte: "8:00 AM"}}}}});
      pipeline.push({$match: {openHours: {$elemMatch: {closes: {$lte: "5:00 PM"}}}}});
    }

    const businesses = await BusinessModel.aggregate([
      ...pipeline,
      {$sort: {createdAt: -1}},
      {$sort: {updatedAt: -1}},
      {
        $facet: {
          metadata: [{$count: 'total'}],
          items: [{$skip: (page - 1) * perPage}, {$limit: perPage}]
        }
      },
      {
        $project: {
          items: 1,
          total: {$arrayElemAt: ['$metadata.total', 0]}
        }
      },
    ]);
    return {items: businesses[0].items, total: businesses[0].total};
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
  resolve: async (
    {
      args: {
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
      }, context: {user}
    }) => {
    let bizId = "";
    await BusinessModel.create(
      {
        businessName,
        phoneNumbers,
        phoneNumber: phoneNumbers,
        claimed,
        location,
        locationDescription,
        pictures,
        categories,
        searchIndex,
        categoryIndex,
        lng,
        lat,
        lngLat: {
          type: "Point",
          coordinates: [lng, lat]
        },
        branch: "MAIN",
        owner: user._id,
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
          phoneNumber: businesses[i].phoneNumbers,
          claimed: businesses[i].claimed,
          location: businesses[i].location,
          locationDescription: businesses[i].locationDescription,
          pictures: businesses[i].pictures,
          categories: businesses[i].categories,
          searchIndex: businesses[i].searchIndex,
          categoryIndex: businesses[i].categoryIndex,
          lng: businesses[i].lng,
          lat: businesses[i].lat,
          lngLat: {
            type: "Point",
            coordinates: [businesses[i].lng, businesses[i].lat]
          },
          branch: "MAIN",
          owner: user._id,
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
    await BusinessListModel.findOneAndDelete({autocompleteTerm: business.businessName.toLowerCase()});
  },
};

const businessCreateBranch = {
  name: "businessCreateBranch",
  kind: "mutation",
  type: BusinessTC.getResolver("updateById").getType(),
  args: {
    branch: BusinessCreateBranchInput
  },
  resolve: async ({args: {branch}}) => {
    await BusinessModel.findByIdAndUpdate(branch.id, {
      $addToSet: {
        branches: {
          branchName: branch.branchName,
          phoneNumbers: branch.phoneNumbers,
          location: branch.location,
          locationDescription: branch.locationDescription,
          lng: branch.lng,
          lat: branch.lat,
          pictures: branch.pictures
        }
      }
    });
    return {recordId: branch.id};
  },
};

const businessDeleteBranch = {
  name: "businessDeleteBranch",
  kind: "mutation",
  type: BusinessTC.getResolver("updateById").getType(),
  args: {
    businessId: "String",
    branchId: "String",
  },
  resolve: async ({args: {branchId, businessId}}) => {
    await BusinessModel.findByIdAndUpdate(businessId, {
      $pull: {branches: {_id: branchId}}
    });
    return {recordId: branchId};
  },
};

const businessAddPost = {
  name: "businessAddPost",
  kind: "mutation",
  type: BusinessTC.getResolver("updateById").getType(),
  args: {
    businessId: "String",
    postId: "String",
  },
  resolve: async ({args: {postId, businessId}}) => {
    await BusinessModel.findByIdAndUpdate(businessId, {
      $addToSet: {posts: postId}
    });
    return {recordId: businessId};
  },
};

const businessRemovePost = {
  name: "businessRemovePost",
  kind: "mutation",
  type: BusinessTC.getResolver("updateById").getType(),
  args: {
    businessId: "String",
    postId: "String",
  },
  resolve: async ({args: {postId, businessId}}) => {
    await BusinessModel.findByIdAndUpdate(businessId, {
      $pull: {posts: postId}
    });
    return {recordId: businessId};
  },
};

const businessAddEvent = {
  name: "businessAddEvent",
  kind: "mutation",
  type: BusinessTC.getResolver("updateById").getType(),
  args: {
    businessId: "String",
    eventId: "String",
  },
  resolve: async ({args: {eventId, businessId}}) => {
    await BusinessModel.findByIdAndUpdate(businessId, {
      $addToSet: {events: eventId}
    });
    return {recordId: businessId};
  },
};

const businessRemoveEvent = {
  name: "businessRemoveEvent",
  kind: "mutation",
  type: BusinessTC.getResolver("updateById").getType(),
  args: {
    businessId: "String",
    eventId: "String",
  },
  resolve: async ({args: {eventId, businessId}}) => {
    await BusinessModel.findByIdAndUpdate(businessId, {
      $pull: {events: eventId}
    });
    return {recordId: businessId};
  },
};

const businessReset = {
  name: "businessReset",
  kind: "mutation",
  type: BusinessTC,
  args: {},
  resolve: async () => {
    const bizs = await BusinessModel.find();
    for (let i = 0; i < bizs.length; i++) {
      const nb = await BusinessModel.findById(bizs[i]._id, {
        lat: 1, lng: 1, businessName: 1
      });
      await BusinessModel.findByIdAndUpdate(bizs[i]._id, {
        lngLat: {
          type: "Point",
          coordinates: [nb.lng, nb.lat]
        }
      });
      console.log(i + 1, nb.businessName);
    }
  },
};

export default {
  getBusinessesByFilter,
  businessLikeUnLike,
  businessCreateOneCustomAdmin,
  businessCreateManyCustom,
  removeByIdCustom,
  businessCreateBranch,
  businessDeleteBranch,
  businessAddPost,
  businessRemovePost,
  businessAddEvent,
  businessRemoveEvent,
  businessReset,
};
