import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

const PathsSchema = new Schema({
  name: {
    type: String,
  },
  path: {
    type: String,
  },
  color: {
    type: Boolean,
  },
});

const MainSubscriptionSchema = new Schema({
  subscription: {
    type: String,
  },
  price: {
    type: Number,
  },
  allowedPaths: {
    type: [PathsSchema],
  },
});

MainSubscriptionSchema.plugin(timestamps);

MainSubscriptionSchema.index({
  createdAt: 1,
  updatedAt: 1,
}, { background: false });

const MainSubscriptionModel = mongoose.model("MainSubScription", MainSubscriptionSchema);
const MainSubscriptionTC = composeWithMongoose(MainSubscriptionModel);

export { MainSubscriptionModel, MainSubscriptionTC, MainSubscriptionSchema };
