import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

const descriptionListSchema = new Schema({
  field: {
    type: String,
  },
  value: {
    type: String,
  },
});

const PostSchema = new Schema({
  description: {
    type: String,
  },
  descriptionList: {
    type: [descriptionListSchema],
    default: [],
  },
  videos: {
    type: [String],
  },
  photos: {
    type: [String],
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  likeList: {
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

PostSchema.plugin(timestamps);
PostSchema.index({ createdAt: 1, updatedAt: 1 });

const PostModel = mongoose.model("Post", PostSchema);
const PostTC = composeWithMongoose(PostModel);

export { PostModel, PostTC, PostSchema };
