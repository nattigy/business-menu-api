import {SchemaComposer} from "graphql-compose";
import {UserQuery, UserMutation} from "./user";
import {BusinessQuery, BusinessMutation} from "./business";
import {CategoryQuery, CategoryMutation} from "./category";
import {BusinessListQuery, BusinessListMutation} from "./businessList";
import {PostQuery, PostMutation} from "./post";
import {EventQuery, EventMutation} from "./event";
import {CouponQuery, CouponMutation} from "./coupon";
import {RequestQuery, RequestMutation} from "./request";

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
