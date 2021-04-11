import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

import openHoursSchema from "./openHours";

export const BusinessSchema = new Schema(
  {
    businessName: {
      type: String,
      trim: true,
      index: true,
      default: "",
    },
    phoneNumber: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      index: true,
      default: "",
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
    slogan: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "",
    },
    history: {
      type: String,
      default: "",
    },
    establishedIn: {
      type: String,
      default: "",
    },
    subscription: {
      type: String,
      enum: ["FREE", "FEATHER_1", "FEATHER_2", "FEATHER_3", "FEATHER_4"],
      default: "Free",
    },
    openHours: {
      type: [openHoursSchema],
      default: [],
    },
    searchIndex: {
      type: [String],
      index: true,
      default: [],
    },
    categoriesName: {
      type: [String],
      index: true,
      default: [],
    },
    pictures: {
      type: [String],
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
    collection: "businesses",
  }
);

BusinessSchema.plugin(timestamps);

BusinessSchema.index({ createdAt: 1, updatedAt: 1 });

export const Business = mongoose.model("Business", BusinessSchema);
export const BusinessTC = composeWithMongoose(Business);
