import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

const MainCategoryListSchema = new Schema({
  name: {
    type: String, trim: true, index: true,
  }, image: String, sub_categories: {
    type: [String],
  }, subCategories: {
    type: [{
      type: Schema.Types.ObjectId, ref: "Category",
    }], default: [],
  },
}, {
  collection: "mainCategoryList",
});

MainCategoryListSchema.plugin(timestamps);
MainCategoryListSchema.index({ createdAt: 1, updatedAt: 1 });

const MainCategoryListModel = mongoose.model("MainCategoryList", MainCategoryListSchema);
const MainCategoryListTC = composeWithMongoose(MainCategoryListModel);

export { MainCategoryListModel, MainCategoryListTC, MainCategoryListSchema };
