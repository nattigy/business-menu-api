import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

const CouponSchema = new Schema(
  {
    taken: {
      type: Boolean,
      default: false
    },
    sold: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "FREE",
      enum: ["FREE", "PAID"],
    },
    value: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    expiryDate: {
      type: Date,
    },
    subscription: {
      type: String,
      enum: ["FEATHER_0", "FEATHER_1", "FEATHER_2", "FEATHER_3", "FEATHER_4", "SPONSORED"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
    },
  },
  {
    collection: "coupons",
  }
);

CouponSchema.plugin(timestamps);
CouponSchema.index({createdAt: 1, updatedAt: 1});

const CouponModel = mongoose.model("Coupon", CouponSchema);
const CouponTC = composeWithMongoose(CouponModel);

export {CouponModel, CouponTC, CouponSchema};
