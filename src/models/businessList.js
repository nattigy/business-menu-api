import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

export const BusienssListSchema = new Schema(
  {
    autocompleteTerm: {
      type: String,
    },
  },
  {
    collection: "businessLists",
  }
);

BusienssListSchema.plugin(timestamps);

BusienssListSchema.index({ createdAt: 1, updatedAt: 1 });

export const BusienssList = mongoose.model("BusienssList", BusienssListSchema);
export const BusienssListTC = composeWithMongoose(BusienssList);
