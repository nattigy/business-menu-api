import { Schema } from "mongoose";

export const postSchema = new Schema({
  description: {
    type: String,
  },
  video: {
    type: [String],
  },
  photos: {
    type: [String],
  },
});

postSchema.index({ createdAt: 1, updatedAt: 1 });

export default postSchema;
