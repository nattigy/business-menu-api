import { SchemaComposer } from "graphql-compose";
import { UserQuery, UserMutation } from "./user";
import { BusinessQuery, BusinessMutation } from "./business";
import { CategoryQuery, CategoryMutation } from "./category";

// import db from "../utils/db"; // eslint-disable-line no-unused-vars

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...UserQuery,
  ...BusinessQuery,
  ...CategoryQuery,
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...BusinessMutation,
  ...CategoryMutation,
});

export default schemaComposer.buildSchema();
