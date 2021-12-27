import { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  type: {
    type: String,
    default: "FREE",
    enum: ["FREE", "PAID"],
  },
  duration: {
    type: Number,
  },
  expiryDate: {
    type: Date,
  },
  subscription: {
    type: String,
  },
  isExpired: {
    type: Boolean,
  },
});

export { subscriptionSchema };
