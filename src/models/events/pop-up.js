import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

const PopUpSchema = new Schema(
  {
    image: {
      type: String,
    },
    category: {
      type: String,
    },
  },
  {
    collection: "popup",
  }
);

PopUpSchema.plugin(timestamps);
PopUpSchema.index({ createdAt: 1, updatedAt: 1 });

const PopUpModel = mongoose.model("PopUp", PopUpSchema);
const PopUpTC = composeWithMongoose(PopUpModel);

export { PopUpModel, PopUpTC, PopUpSchema };
