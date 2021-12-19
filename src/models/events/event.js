import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

const EventSchema = new Schema({
  title: {
    type: String,
  }, description: {
    type: String,
  }, location: {
    type: String,
  }, link: {
    type: String,
  }, startDate: {
    type: Date, index: true,
  }, endDate: {
    type: Date, index: true,
  }, startTime: {
    type: String,
  }, endTime: {
    type: String,
  }, videos: {
    type: [String],
  }, photos: {
    type: [String],
  }, isInterested: {
    type: Boolean, default: false,
  }, interestedUsers: {
    type: [{
      type: Schema.Types.ObjectId, ref: "User",
    }], default: [],
  }, owner: {
    type: Schema.Types.ObjectId, ref: "Business",
  },
});

EventSchema.plugin(timestamps);
EventSchema.index({ createdAt: 1, updatedAt: 1 });

const EventModel = mongoose.model("Event", EventSchema);
const EventTC = composeWithMongoose(EventModel);

export { EventModel, EventTC, EventSchema };
