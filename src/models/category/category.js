import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
    },
    image: String,
    parent: {
      type: String,
      index: true,
    },
    autocompleteTerm: {
      type: String,
      index: true,
    },
    categoryIndex: {
      type: [String],
      index: true,
    },
  },
  {
    collection: "categories",
  }
);

CategorySchema.plugin(timestamps);
CategorySchema.index({ createdAt: 1, updatedAt: 1 });

const CategoryModel = mongoose.model("Category", CategorySchema);
const CategoryTC = composeWithMongoose(CategoryModel);

export { CategoryModel, CategoryTC, CategorySchema };
