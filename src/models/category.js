import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

export const CategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    parent: {
      type: String,
    },
    autocompleteTerm: {
      type: String,
    },
    categoryIndex: {
      type: [String],
      index: true
    }
  },
  {
    collection: "categories",
  }
);

CategorySchema.plugin(timestamps);

CategorySchema.index({createdAt: 1, updatedAt: 1});

export const Category = mongoose.model("Category", CategorySchema);
export const CategoryTC = composeWithMongoose(Category);
