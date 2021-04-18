import {SchemaComposer} from "graphql-compose";
import {UserQuery, UserMutation} from "./user";
import {BusinessQuery, BusinessMutation} from "./business";
import {CategoryQuery, CategoryMutation} from "./category";
import {BusinessListQuery, BusinessListMutation} from "./businessList";
import {PostQuery, PostMutation} from "./post";
import {EventQuery, EventMutation} from "./event";
import {CouponQuery, CouponMutation} from "./coupon";

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
    ...UserQuery,
    ...BusinessQuery,
    ...CategoryQuery,
    ...PostQuery,
    ...EventQuery,
    ...BusinessListQuery,
    ...CouponQuery
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
    ...BusinessMutation,
    ...CategoryMutation,
    ...PostMutation,
    ...EventMutation,
    ...BusinessListMutation,
    ...CouponMutation
});

export default schemaComposer.buildSchema();
