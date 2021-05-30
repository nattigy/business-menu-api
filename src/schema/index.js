import {SchemaComposer} from "graphql-compose";
import {UserMutation, UserQuery} from "./user";
import {BusinessMutation, BusinessQuery} from "./business";
import {CategoryMutation, CategoryQuery} from "./category";
import {BusinessListMutation, BusinessListQuery} from "./businessList";
import {PostMutation, PostQuery} from "./post";
import {EventMutation, EventQuery} from "./event";
import {CouponMutation, CouponQuery} from "./coupon";
import {RequestMutation, RequestQuery} from "./request";

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...UserQuery,
  ...BusinessQuery,
  ...CategoryQuery,
  ...PostQuery,
  ...EventQuery,
  ...BusinessListQuery,
  ...CouponQuery,
  ...RequestQuery
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...BusinessMutation,
  ...CategoryMutation,
  ...PostMutation,
  ...EventMutation,
  ...BusinessListMutation,
  ...CouponMutation,
  ...RequestMutation
});

export default schemaComposer.buildSchema();
