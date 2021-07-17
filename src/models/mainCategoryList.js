import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

export const MainCategoryListSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    image: String,
    sub_categories: {
      type: [String],
    }
  },
  {
    collection: "mainCategoryList",
  }
);

MainCategoryListSchema.plugin(timestamps);

MainCategoryListSchema.index({createdAt: 1, updatedAt: 1});

export const MainCategoryList = mongoose.model("MainCategoryList", MainCategoryListSchema);
export const MainCategoryListTC = composeWithMongoose(MainCategoryList);
