import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

export const CouponSchema = new Schema(
    {
        used: {
            type: Boolean,
        },
        registered: {
            type: Boolean,
        },
        value: {
            type: Number,
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

export const Coupon = mongoose.model("Coupon", CouponSchema);
export const CouponTC = composeWithMongoose(Coupon);
