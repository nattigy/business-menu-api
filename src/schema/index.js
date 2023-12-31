import { SchemaComposer } from "graphql-compose";

import { UserMutation, UserQuery } from "./user/user";
import { BusinessMutation, BusinessQuery } from "./business/business";
import { SponsoredMutation, SponsoredQuery } from "./sponsored/sponsored";
import { TemporaryMutation, TemporaryQuery } from "./temporary/temporary";
import { CategoryMutation, CategoryQuery } from "./category/category";
import { BusinessListMutation, BusinessListQuery } from "./business-list/business-list";
import { PostMutation, PostQuery } from "./post/post";
import { EventMutation, EventQuery } from "./events/event";
import { CouponMutation, CouponQuery } from "./coupon/coupon";
import { RequestMutation, RequestQuery } from "./request/request";
import { ZorittMutation, ZorittQuery } from "./zoritt/zoritt";
import { PopUpMutation, PopUpQuery } from "./pop-up/pop-up";
import { MainSubscriptionMutation, MainSubscriptionQuery } from "./main-subscription/main-subscription";
import { MainCategoryListTCMutation, MainCategoryListTCQuery } from "./main-category-list/main-category-list";
import { ClaimRequestQuery, ClaimRequestMutation } from "./claim-request/claim-request.js";

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...UserQuery,
  ...BusinessQuery,
  ...SponsoredQuery,
  ...TemporaryQuery,
  ...CategoryQuery,
  ...PostQuery,
  ...EventQuery,
  ...BusinessListQuery,
  ...CouponQuery,
  ...RequestQuery,
  ...ZorittQuery,
  ...PopUpQuery,
  ...MainSubscriptionQuery,
  ...MainCategoryListTCQuery,
  ...ClaimRequestQuery,
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...BusinessMutation,
  ...SponsoredMutation,
  ...TemporaryMutation,
  ...CategoryMutation,
  ...PostMutation,
  ...EventMutation,
  ...BusinessListMutation,
  ...CouponMutation,
  ...RequestMutation,
  ...ZorittMutation,
  ...PopUpMutation,
  ...MainSubscriptionMutation,
  ...MainCategoryListTCMutation,
  ...ClaimRequestMutation,
});

export default schemaComposer.buildSchema();
