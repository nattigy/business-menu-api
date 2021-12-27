import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

const ClaimRequestSchema = new Schema({
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "CANCELED"],
    default: "PENDING",
  },
  licensePicture: {
    type: String,
    default: [],
  },
  userIdPicture: {
    type: String,
    default: [],
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: "Business",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}, { collection: "claimRequests" });

ClaimRequestSchema.plugin(timestamps);

ClaimRequestSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

const ClaimRequestModel = mongoose.model("ClaimRequest", ClaimRequestSchema);
const ClaimRequestTC = composeWithMongoose(ClaimRequestModel);

export { ClaimRequestModel, ClaimRequestTC, ClaimRequestSchema };
