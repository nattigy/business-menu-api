import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

export const UserSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["Normal", "Owner", "Admin", "Sales"],
    },
    businesses: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Business",
        },
      ],
    },
  },
  {
    collection: "users",
  }
);

UserSchema.plugin(timestamps);

UserSchema.index({ createdAt: 1, updatedAt: 1 });

export const User = mongoose.model("User", UserSchema);
export const UserTC = composeWithMongoose(User);
