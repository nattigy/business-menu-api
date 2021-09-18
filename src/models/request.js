import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

const RequestSchema = new Schema(
  {
    reference: {
      type: String,
    },
    amount: {
      type: Number,
    },
    bankName: {
      type: String,
    },
    dateDeposited: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["PENDING", "DONE", "NOT_DEPOSITED", "NOT_FOUND"],
      default: "PENDING",
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
    },
  },
  {
    collection: "requests",
  }
);

RequestSchema.plugin(timestamps);
RequestSchema.index({createdAt: 1, updatedAt: 1});

const RequestModel = mongoose.model("Request", RequestSchema);
const RequestTC = composeWithMongoose(RequestModel);

module.exports = {RequestModel, RequestTC, RequestSchema};
