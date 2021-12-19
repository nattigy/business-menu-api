import { Schema } from "mongoose";

const openHoursSchema = new Schema({
  day: {
    type: String, index: true,
  }, opens: {
    type: String, index: true,
  }, closes: {
    type: String, index: true,
  }, isOpen: {
    type: Boolean, index: true,
  },
});

export { openHoursSchema };
