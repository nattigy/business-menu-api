"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CategoryMutation = exports.CategoryQuery = undefined;

var _category = require("../models/category");

const CategoryQuery = {
  categoryById: _category.CategoryTC.getResolver("findById"),
  categoryByIds: _category.CategoryTC.getResolver("findByIds"),
  categoryOne: _category.CategoryTC.getResolver("findOne"),
  categoryMany: _category.CategoryTC.getResolver("findMany"),
  categoryCount: _category.CategoryTC.getResolver("count"),
  categoryConnection: _category.CategoryTC.getResolver("connection"),
  categoryPagination: _category.CategoryTC.getResolver("pagination")
};
const CategoryMutation = {
  categoryCreateOne: _category.CategoryTC.getResolver("createOne"),
  categoryCreateMany: _category.CategoryTC.getResolver("createMany"),
  categoryUpdateById: _category.CategoryTC.getResolver("updateById"),
  categoryUpdateOne: _category.CategoryTC.getResolver("updateOne"),
  categoryUpdateMany: _category.CategoryTC.getResolver("updateMany"),
  categoryRemoveById: _category.CategoryTC.getResolver("removeById"),
  categoryRemoveOne: _category.CategoryTC.getResolver("removeOne"),
  categoryRemoveMany: _category.CategoryTC.getResolver("removeMany")
};
exports.CategoryQuery = CategoryQuery;
exports.CategoryMutation = CategoryMutation;