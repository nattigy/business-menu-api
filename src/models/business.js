import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

import openHoursSchema from "./openHours";

export const BusinessSchema = new Schema(
  {
    businessName: {
      type: String,
      trim: true,
      // index: true
    },
    phoneNumber: {
      type: [String],
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
    searchIndex: {
      type: [String],
      index: true
    },
    pictures: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Photo",
        },
      ],
    },
    posts: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
    },
    events: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
      ],
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
