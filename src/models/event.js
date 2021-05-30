import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

export const eventSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  link: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  videos: {
    type: [String],
  },
  photos: {
    type: [String],
  },
  isInterested: {
    type: Boolean,
    default: false,
  },
  interestedUsers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Business",
  },
});

eventSchema.plugin(timestamps);

eventSchema.index({createdAt: 1, updatedAt: 1});

export const Event = mongoose.model("Event", eventSchema);
export const EventTC = composeWithMongoose(Event);
