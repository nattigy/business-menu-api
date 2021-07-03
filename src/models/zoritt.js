import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

export const ZorittSchema = new Schema(
  {
    userAppHomePageImages: {
      type: [String],
    }
  },
  {
    collection: "zoritt",
  }
);

ZorittSchema.plugin(timestamps);

ZorittSchema.index({createdAt: 1, updatedAt: 1});

export const Zoritt = mongoose.model("Zoritt", ZorittSchema);
export const ZorittTC = composeWithMongoose(Zoritt);
