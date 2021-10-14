import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

const SponsoredSchema = new Schema(
  {
    businessName: {
      type: String,
      trim: true,
      index: true,
      default: "",
    },
    phoneNumbers: {
      type: [String],
      default: [],
      index: true
    },
    emails: {
      type: [String],
      trim: true,
      default: [],
    },
    website: {
      type: String,
      default: "",
    },
    logoPics: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      index: true,
      default: "",
    },
    locationDescription: {
      type: String,
      index: true,
      default: "",
    },
    lat: {
      type: Number,
      index: true,
    },
    lng: {
      type: Number,
      index: true,
    },
    distance: {
      type: Number,
      index: true,
    },
    slogan: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      enum: ["ACTIVE", "BLOCKED", "NOT_VERIFIED"],
      default: "ACTIVE",
    },
    pictures: {
      type: [String],
      default: [],
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    favoriteList: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    posts: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: [],
    },
    events: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
      ],
      default: [],
    },
    categories: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "sponsored",
  }
);

SponsoredSchema.plugin(timestamps);
SponsoredSchema.index({createdAt: 1, updatedAt: 1});

const SponsoredModel = mongoose.model("Sponsored", SponsoredSchema);
const SponsoredTC = composeWithMongoose(SponsoredModel);

export {SponsoredModel, SponsoredTC, SponsoredSchema};
