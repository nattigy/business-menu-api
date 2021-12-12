import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

const TemporarySchema = new Schema(
  {
    businessName: {
      type: String,
      trim: true,
      default: "",
    },
    claimed: {
      type: Boolean,
      default: true,
    },
    phoneNumbers: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "",
    },
    locationDescription: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      enum: ["ACTIVE", "BLOCKED", "NOT_VERIFIED"],
      default: "ACTIVE",
    },
    searchAutocomplete: {
      type: String,
      index: true,
    },
    lngLat: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    searchIndex: {
      type: [String],
      index: true,
      default: [],
    },
    pictures: {
      type: [String],
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
    collection: "temporaries",
  }
);

TemporarySchema.plugin(timestamps);
TemporarySchema.index({ createdAt: 1, updatedAt: 1 });

const TemporaryModel = mongoose.model("Temporary", TemporarySchema);
const TemporaryTC = composeWithMongoose(TemporaryModel);

export { TemporaryModel, TemporaryTC, TemporarySchema };
