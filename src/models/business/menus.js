import { Schema } from "mongoose";

const menuListSchema = new Schema({
  image: {
    type: String,
  }, name: {
    type: String,
  }, price: {
    type: String,
  }, discount: {
    type: String,
  }, description: {
    type: String,
  },
});

const menuSchema = new Schema({
  category: {
    type: String,
  }, menuList: {
    type: [menuListSchema], default: [],
  },
});

export { menuSchema };
