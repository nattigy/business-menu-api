"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BusinessListMutation = exports.BusinessListQuery = undefined;

var _businessList = require("../models/businessList");

const BusinessListQuery = {
  businessListById: _businessList.BusinessListTC.getResolver("findById"),
  businessListByIds: _businessList.BusinessListTC.getResolver("findByIds"),
  businessListOne: _businessList.BusinessListTC.getResolver("findOne"),
  businessListMany: _businessList.BusinessListTC.getResolver("findMany"),
  businessListCount: _businessList.BusinessListTC.getResolver("count"),
  businessListConnection: _businessList.BusinessListTC.getResolver("connection"),
  businessListPagination: _businessList.BusinessListTC.getResolver("pagination")
};
const BusinessListMutation = {
  businessListCreateOne: _businessList.BusinessListTC.getResolver("createOne"),
  businessListCreateMany: _businessList.BusinessListTC.getResolver("createMany"),
  businessListUpdateById: _businessList.BusinessListTC.getResolver("updateById"),
  businessListUpdateOne: _businessList.BusinessListTC.getResolver("updateOne"),
  businessListUpdateMany: _businessList.BusinessListTC.getResolver("updateMany"),
  businessListRemoveById: _businessList.BusinessListTC.getResolver("removeById"),
  businessListRemoveOne: _businessList.BusinessListTC.getResolver("removeOne"),
  businessListRemoveMany: _businessList.BusinessListTC.getResolver("removeMany")
};
exports.BusinessListQuery = BusinessListQuery;
exports.BusinessListMutation = BusinessListMutation;