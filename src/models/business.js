import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

const openHoursSchema = new Schema({
  day: {
    type: String,
  },
  opens: {
    type: String,
  },
  closes: {
    type: String,
  },
  isOpen: {
    type: Boolean,
  }
});

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
  }
});

const branchesSchema = new Schema({
  phoneNumber: {
    type: [String],
    default: [],
  },
  emails: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    default: "",
  },
  locationDescription: {
    type: String,
    default: "",
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  distance: {
    type: Number,
  },
  pictures: {
    type: String,
    default: "",
  },
});

const menuListSchema = new Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  price: {
    type: String,
  },
  discount: {
    type: String,
  },
  description: {
    type: String,
  },
});

const restaurantMenuSchema = new Schema({
  category: {
    type: String,
  },
  menuList: {
    type: [menuListSchema],
    default: [],
  },
});

const BusinessSchema = new Schema(
  {
    businessName: {
      type: String,
      trim: true,
      index: true,
      default: "",
    },
    claimed: {
      type: Boolean,
      default: true,
    },
    phoneNumber: {
      type: [String],
      default: [],
    },
    emails: {
      type: [String],
      trim: true,
      default: [],
    },
    website: {
      type: String,
      default: "",
    },
    logoPics: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      index: true,
      default: "",
    },
    locationDescription: {
      type: String,
      index: true,
      default: "",
    },
    lat: {
      type: Number,
      index: true,
    },
    lng: {
      type: Number,
      index: true,
    },
    distance: {
      type: Number,
      index: true,
    },
    slogan: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "",
    },
    history: {
      type: String,
      default: "",
    },
    establishedIn: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      enum: ["ACTIVE", "BLOCKED", "NOT_VERIFIED"],
      default: "ACTIVE",
    },
    currentSubscription: {
      type: subscriptionSchema,
    },
    subscription: {
      type: String,
      enum: ["FEATHER_0", "FEATHER_1", "FEATHER_2", "FEATHER_3", "FEATHER_4", "SPONSORED"],
      default: "FEATHER_0",
      index: true,
    },
    branches: {
      type: [branchesSchema],
      default: [],
    },
    openHours: {
      type: [openHoursSchema],
      default: [],
    },
    restaurantMenu: {
      type: [restaurantMenuSchema],
      default: [],
    },
    searchAutocomplete: {
      type: String,
      index: true,
    },
    searchIndex: {
      type: [String],
      index: true,
      default: [],
    },
    pictures: {
      type: [String],
      default: [],
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    favoriteList: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    posts: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: [],
    },
    events: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
      ],
      default: [],
    },
    categories: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "businesses",
  }
);

BusinessSchema.plugin(timestamps);
BusinessSchema.index({createdAt: 1, updatedAt: 1});

const BusinessModel = mongoose.model("Business", BusinessSchema);
const BusinessTC = composeWithMongoose(BusinessModel);

export {BusinessModel, BusinessTC, BusinessSchema};
