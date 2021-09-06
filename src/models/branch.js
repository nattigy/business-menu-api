import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

export const BranchSchema = new Schema(
  {
    branchName: {
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
    distance: {
      type: Number,
      index: true,
    },
    emails: {
      type: [String],
      trim: true,
      default: [],
    },
    state: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
    pictures: {
      type: [String],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Business",
    },
  },
  {
    collection: "branches",
  }
);

BranchSchema.plugin(timestamps);

BranchSchema.index({createdAt: 1, updatedAt: 1});

export const Branch = mongoose.model("Branch", BranchSchema);
export const BranchTC = composeWithMongoose(Branch);
