import { Schema } from "mongoose";

export const openHoursSchema = new Schema({
  day: {
    type: String,
  },
  opens: {
    type: String,
  },
  closes: {
    type: String,
  },
});

export default openHoursSchema;
