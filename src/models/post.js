import mongoose,{ Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

export const postSchema = new Schema({
  description: {
    type: String,
  },
  videos: {
    type: [String],
  },
  photos: {
    type: [String],
  },
});

postSchema.plugin(timestamps);

postSchema.index({ createdAt: 1, updatedAt: 1 });

export const Post = mongoose.model("Post", postSchema);
export const PostTC = composeWithMongoose(Post);
