import {SchemaComposer} from "graphql-compose";
import {UserMutation, UserQuery} from "./user/user";
import {BusinessMutation, BusinessQuery} from "./business/business";
import {CategoryMutation, CategoryQuery} from "./category/category";
import {BusinessListMutation, BusinessListQuery} from "./businessList/businessList";
import {PostMutation, PostQuery} from "./post/post";
import {EventMutation, EventQuery} from "./events/event";
import {CouponMutation, CouponQuery} from "./coupon/coupon";
import {RequestMutation, RequestQuery} from "./request/request";
import {ZorittQuery, ZorittMutation} from "./zoritt/zoritt";
import {MainCategoryListTCQuery, MainCategoryListTCMutation} from "./mainCategoryList/mainCategoryList";

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
