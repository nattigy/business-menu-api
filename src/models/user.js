import mongoose, {Schema} from "mongoose";
import {schemaComposer} from "graphql-compose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";
import bcrypt from 'bcryptjs';

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
    role: {
      type: [String],
      default: "NORMAL",
      enum: ["NORMAL", "OWNER", "ADMIN", "SALES"],
    },
    locale: String,
    account: {
      verification: {
        verified: {
          type: Boolean,
          default: false
        },
        token: String,
        expiresIn: Date
      },
      resetPassword: {
        token: String,
        expiresIn: Date
      }
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

UserSchema.statics.emailExist = function (email) {
  return this.findOne({email});
};

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model("User", UserSchema);
const UserTC = composeWithMongoose(UserModel).removeField('password');

const UserAccountTC = UserTC.getFieldTC('account');

UserAccountTC.getFieldTC('verification').removeField(['token', 'expiresIn']);

UserAccountTC.removeField('resetPassword');

schemaComposer.createObjectTC({
  name: 'AccessToken',
  fields: {accessToken: 'String!'}
});

schemaComposer.createObjectTC({
  name: 'Succeed',
  fields: {succeed: 'Boolean!'}
});

schemaComposer.createEnumTC({
  name: 'Locale',
  values: {
    en: {value: 'en'},
    am: {value: 'am'}
  }
});

export {UserModel, UserTC, UserSchema};
