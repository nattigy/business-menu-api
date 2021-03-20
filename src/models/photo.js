import mongoose,{ Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

export const photoSchema = new Schema({
  caption: {
    type: String,
  },
  photo: {
    type: String,
  },
  numberOfLikes: {
      type: [String]
  }
});

photoSchema.plugin(timestamps);

photoSchema.index({ createdAt: 1, updatedAt: 1 });

export const Photo = mongoose.model("Photo", photoSchema);
export const PhotoTC = composeWithMongoose(Photo);
