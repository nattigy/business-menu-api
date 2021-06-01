"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlCompose = require("graphql-compose");

var _user = require("./user");

var _business = require("./business");

var _category = require("./category");

var _businessList = require("./businessList");

var _post = require("./post");

var _event = require("./event");

var _coupon = require("./coupon");

var _request = require("./request");

const schemaComposer = new _graphqlCompose.SchemaComposer();
schemaComposer.Query.addFields({ ..._user.UserQuery,
  ..._business.BusinessQuery,
  ..._category.CategoryQuery,
  ..._post.PostQuery,
  ..._event.EventQuery,
  ..._businessList.BusinessListQuery,
  ..._coupon.CouponQuery,
  ..._request.RequestQuery
});
schemaComposer.Mutation.addFields({ ..._user.UserMutation,
  ..._business.BusinessMutation,
  ..._category.CategoryMutation,
  ..._post.PostMutation,
  ..._event.EventMutation,
  ..._businessList.BusinessListMutation,
  ..._coupon.CouponMutation,
  ..._request.RequestMutation
});
exports.default = schemaComposer.buildSchema();