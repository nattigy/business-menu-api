import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

export const UserSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    firstName: {
      type: String
    },
    middleName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String
    },
    firebaseId: {
      type: String,
    },
    password: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["Normal", "Owner", "Admin", "Sales"],
    },
    interestedInEvents: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
      ],
      default: [],
    },
    favorites: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Business",
        },
      ],
      default: [],
    },
    likedPosts: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: [],
    },
    businesses: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Business",
        },
      ],
      default: [],
    },
    coupons: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Coupon",
        },
      ],
      default: [],
    },
  },
  {
    collection: "users",
  }
);

UserSchema.plugin(timestamps);

UserSchema.index({createdAt: 1, updatedAt: 1});

export const User = mongoose.model("User", UserSchema);
export const UserTC = composeWithMongoose(User);
