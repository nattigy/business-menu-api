import mongoose,{ Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

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
  video: {
    type: [String],
  },
  photos: {
    type: [String],
  },
});

eventSchema.plugin(timestamps);

eventSchema.index({ createdAt: 1, updatedAt: 1 });

export const Event = mongoose.model("Event", eventSchema);
export const EventTC = composeWithMongoose(Event);
