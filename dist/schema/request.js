"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestMutation = exports.RequestQuery = undefined;

var _request = require("../models/request");

const RequestQuery = {
  requestById: _request.RequestTC.getResolver("findById"),
  requestByIds: _request.RequestTC.getResolver("findByIds"),
  requestOne: _request.RequestTC.getResolver("findOne"),
  requestMany: _request.RequestTC.getResolver("findMany"),
  requestCount: _request.RequestTC.getResolver("count"),
  requestConnection: _request.RequestTC.getResolver("connection"),
  requestPagination: _request.RequestTC.getResolver("pagination")
};
const RequestMutation = {
  requestCreateOne: _request.RequestTC.getResolver("createOne"),
  requestCreateMany: _request.RequestTC.getResolver("createMany"),
  requestUpdateById: _request.RequestTC.getResolver("updateById"),
  requestUpdateOne: _request.RequestTC.getResolver("updateOne"),
  requestUpdateMany: _request.RequestTC.getResolver("updateMany"),
  requestRemoveById: _request.RequestTC.getResolver("removeById"),
  requestRemoveOne: _request.RequestTC.getResolver("removeOne"),
  requestRemoveMany: _request.RequestTC.getResolver("removeMany")
};
exports.RequestQuery = RequestQuery;
exports.RequestMutation = RequestMutation;