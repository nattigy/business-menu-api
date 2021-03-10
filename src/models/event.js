import { Schema } from "mongoose";

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

eventSchema.index({ createdAt: 1, updatedAt: 1 });

export default eventSchema;
