import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

import openHoursSchema from "./openHours";
import postSchema from "./post";
import eventSchema from "./event";

export const BusinessSchema = new Schema(
  {
    businessName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: [String],
      index: true,
    },
    location: {
      type: String,
      index: true,
    },
    emails: {
      type: [String],
      trim: true,
    },
    website: {
      type: String,
    },
    logoPics: {
      type: [String],
    },
    pictures: {
      type: [String],
    },
    slogan: {
      type: String,
    },
    description: {
      type: String,
    },
    specialization: {
      type: String,
    },
    history: {
      type: String,
    },
    establishedIn: {
      type: Date,
    },
    subscription: {
      type: String,
    },
    openHours: {
      type: [openHoursSchema],
      default: [],
    },
    posts: {
      type: [postSchema],
    },
    events: {
      type: [eventSchema],
    },
    categories: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
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
