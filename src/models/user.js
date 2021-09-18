import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

const UserSchema = new Schema(
  {
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
    image: {
      type: String
    },
    firebaseId: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "BLOCKED"],
    },
    userType: {
      type: String,
      default: "Normal",
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

const UserModel = mongoose.model("User", UserSchema);
const UserTC = composeWithMongoose(UserModel);

module.exports = {UserModel, UserTC, UserSchema};
