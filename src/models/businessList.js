import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

export const BusinessListSchema = new Schema(
  {
    autocompleteTerm: {
      type: String,
      index: true,
    },
  },
  {
    collection: "businessLists",
  }
);

BusinessListSchema.plugin(timestamps);

BusinessListSchema.index({createdAt: 1, updatedAt: 1});

export const BusinessList = mongoose.model("BusinessList", BusinessListSchema);
export const BusinessListTC = composeWithMongoose(BusinessList);
