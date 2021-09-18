import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";
import {composeWithMongoose} from "graphql-compose-mongoose";

const ZorittSchema = new Schema(
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

const ZorittModel = mongoose.model("Zoritt", ZorittSchema);
const ZorittTC = composeWithMongoose(ZorittModel);

module.exports = {ZorittModel, ZorittTC, ZorittSchema};
