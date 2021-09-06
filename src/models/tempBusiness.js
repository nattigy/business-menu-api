import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

export const TempBusinessSchema = new Schema(
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
    state: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
    searchAutocomplete: {
      type: String,
      index: true,
    },
    searchIndex: {
      type: [String],
      index: true,
      default: [],
    },
    categoryIndex: {
      type: [String],
      index: true,
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
    collection: "tempBusinesses",
  }
);

TempBusinessSchema.plugin(timestamps);

TempBusinessSchema.index({createdAt: 1, updatedAt: 1});

export const TempBusiness = mongoose.model("TempBusiness", TempBusinessSchema);
export const TempBusinessTC = composeWithMongoose(TempBusiness);
