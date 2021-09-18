import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

const MainCategoryListSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
    },
    image: String,
    subCategories: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      default: [],
    },
  },
  {
    collection: "mainCategoryList",
  }
);

MainCategoryListSchema.plugin(timestamps);
MainCategoryListSchema.index({createdAt: 1, updatedAt: 1});

export const MainCategoryListModel = mongoose.model("MainCategoryList", MainCategoryListSchema);
export const MainCategoryListTC = composeWithMongoose(MainCategoryListModel);

module.exports = {MainCategoryListModel, MainCategoryListTC, MainCategoryListSchema};
