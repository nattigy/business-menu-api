import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

const BusinessListSchema = new Schema(
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

const BusinessListModel = mongoose.model("BusinessList", BusinessListSchema);
const BusinessListTC = composeWithMongoose(BusinessListModel);

export {BusinessListModel, BusinessListTC, BusinessListSchema};
