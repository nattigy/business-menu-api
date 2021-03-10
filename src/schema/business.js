import { BusinessTC } from "../models/business";
import { CategoryTC } from "../models/categories";
import { UserTC } from "../models/user";

const BusinessQuery = {
  businessById: BusinessTC.mongooseResolvers.findById(),
  businessByIds: BusinessTC.mongooseResolvers.findByIds(),
  businessOne: BusinessTC.mongooseResolvers.findOne(),
  businessMany: BusinessTC.mongooseResolvers.findMany(),
  businessDataLoader: BusinessTC.mongooseResolvers.dataLoader(),
  businessDataLoaderMany: BusinessTC.mongooseResolvers.dataLoaderMany(),
  businessByIdLean: BusinessTC.mongooseResolvers.findByIdLean(),
  businessByIdsLean: BusinessTC.mongooseResolvers.findByIdsLean(),
  businessOneLean: BusinessTC.mongooseResolvers.findOneLean(),
  businessManyLean: BusinessTC.mongooseResolvers.findManyLean(),
  businessDataLoaderLean: BusinessTC.mongooseResolvers.dataLoaderLean(),
  businessDataLoaderManyLean: BusinessTC.mongooseResolvers.dataLoaderManyLean(),
  businessCount: BusinessTC.mongooseResolvers.count(),
  businessConnection: BusinessTC.mongooseResolvers.connection(),
  businessPagination: BusinessTC.mongooseResolvers.pagination(),
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
  businessCreateOne: BusinessTC.mongooseResolvers.createOne(),
  businessCreateMany: BusinessTC.mongooseResolvers.createMany(),
  businessUpdateById: BusinessTC.mongooseResolvers.updateById(),
  businessUpdateOne: BusinessTC.mongooseResolvers.updateOne(),
  businessUpdateMany: BusinessTC.mongooseResolvers.updateMany(),
  businessRemoveById: BusinessTC.mongooseResolvers.removeById(),
  businessRemoveOne: BusinessTC.mongooseResolvers.removeOne(),
  businessRemoveMany: BusinessTC.mongooseResolvers.removeMany(),
};

export { BusinessQuery, BusinessMutation };
