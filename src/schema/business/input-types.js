import {schemaComposer, toInputObjectType} from "graphql-compose";

const BusinessCreateInputTC = schemaComposer.createObjectTC({
  name: 'BusinessCreateManyCustomInput',
  fields: {
    businessName: "String!",
    phoneNumbers: ["String!"],
    location: "String!",
    locationDescription: "String!",
    pictures: ["String!"],
    categories: ["String!"],
    searchIndex: ["String!"],
    categoryIndex: ["String!"],
    claimed: "Boolean!",
    lng: "Float!",
    lat: "Float!",
  }
});

export const BusinessCreateManyCustomInput = toInputObjectType(BusinessCreateInputTC);

const BusinessCreateBranchInputTC = schemaComposer.createObjectTC({
  name: 'BusinessCreateBranchInput',
  fields: {
    id: "String!",
    branchName: "String!",
    phoneNumbers: "[String!]!",
    location: "String!",
    locationDescription: "String",
    lng: "Float!",
    lat: "Float!",
    pictures: "[String]",
  }
});

export const BusinessCreateBranchInput = toInputObjectType(BusinessCreateBranchInputTC);