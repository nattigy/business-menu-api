import { SchemaComposer } from "graphql-compose";
import { UserQuery, UserMutation } from "./user";
import { BusinessQuery, BusinessMutation } from "./business";
import { CategoryQuery, CategoryMutation } from "./category";
import { PostQuery, PostMutation } from "./post";
import { EventQuery, EventMutation } from "./event";

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...UserQuery,
  ...BusinessQuery,
  ...CategoryQuery,
  ...PostQuery,
  ...EventQuery,
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...BusinessMutation,
  ...CategoryMutation,
  ...PostMutation,
  ...EventMutation,
});

export default schemaComposer.buildSchema();
