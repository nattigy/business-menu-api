import { BusinessTC } from "../models/business";
import { CategoryTC } from "../models/categories";
import { UserTC } from "../models/user";

const BusinessQuery = {
  businessById: BusinessTC.getResolver("findById"),
  businessByIds: BusinessTC.getResolver("findByIds"),
  businessOne: BusinessTC.getResolver("findOne"),
  businessMany: BusinessTC.getResolver("findMany"),
  businessCount: BusinessTC.getResolver("count"),
  businessConnection: BusinessTC.getResolver("connection"),
  businessPagination: BusinessTC.getResolver("pagination"),
  businessCategories: BusinessTC.addRelation("categories", {
    resolver: () => CategoryTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.categories,
    },
    projection: { categories: 1 },
  }),
  businessOwner: BusinessTC.addRelation("owner", {
    resolver: () => UserTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: { owner: 1 },
  }),
};

const BusinessMutation = {
  businessCreateOne: BusinessTC.getResolver("createOne"),
  businessCreateMany: BusinessTC.getResolver("createMany"),
  businessUpdateById: BusinessTC.getResolver("updateById"),
  businessUpdateOne: BusinessTC.getResolver("updateOne"),
  businessUpdateMany: BusinessTC.getResolver("updateMany"),
  businessRemoveById: BusinessTC.getResolver("removeById"),
  businessRemoveOne: BusinessTC.getResolver("removeOne"),
  businessRemoveMany: BusinessTC.getResolver("removeMany"),
};

export { BusinessQuery, BusinessMutation };
