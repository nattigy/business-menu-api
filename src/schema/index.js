import {SchemaComposer} from "graphql-compose";
import {UserMutation, UserQuery} from "./user";
import {BusinessMutation, BusinessQuery} from "./business";
import {CategoryMutation, CategoryQuery} from "./category";
import {BusinessListMutation, BusinessListQuery} from "./businessList";
import {PostMutation, PostQuery} from "./post";
import {EventMutation, EventQuery} from "./event";
import {CouponMutation, CouponQuery} from "./coupon";
import {RequestMutation, RequestQuery} from "./request";
import {ZorittQuery, ZorittMutation} from "./zoritt";
import {MainCategoryListTCQuery, MainCategoryListTCMutation} from "./mainCategoryList";

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...UserQuery,
  ...BusinessQuery,
  ...CategoryQuery,
  ...PostQuery,
  ...EventQuery,
  ...BusinessListQuery,
  ...CouponQuery,
  ...RequestQuery,
  ...ZorittQuery,
  ...MainCategoryListTCQuery,
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...BusinessMutation,
  ...CategoryMutation,
  ...PostMutation,
  ...EventMutation,
  ...BusinessListMutation,
  ...CouponMutation,
  ...RequestMutation,
  ...ZorittMutation,
  ...MainCategoryListTCMutation,
});

export default schemaComposer.buildSchema();
