import { CategoryTC } from "../models/categories";
import { BusinessTC } from "../models/business";

const CategoryQuery = {
  categoryById: CategoryTC.mongooseResolvers.findById(),
  categoryByIds: CategoryTC.mongooseResolvers.findByIds(),
  categoryOne: CategoryTC.mongooseResolvers.findOne(),
  categoryMany: CategoryTC.mongooseResolvers.findMany(),
  categoryDataLoader: CategoryTC.mongooseResolvers.dataLoader(),
  categoryDataLoaderMany: CategoryTC.mongooseResolvers.dataLoaderMany(),
  categoryByIdLean: CategoryTC.mongooseResolvers.findByIdLean(),
  categoryByIdsLean: CategoryTC.mongooseResolvers.findByIdsLean(),
  categoryOneLean: CategoryTC.mongooseResolvers.findOneLean(),
  categoryManyLean: CategoryTC.mongooseResolvers.findManyLean(),
  categoryDataLoaderLean: CategoryTC.mongooseResolvers.dataLoaderLean(),
  categoryDataLoaderManyLean: CategoryTC.mongooseResolvers.dataLoaderManyLean(),
  categoryCount: CategoryTC.mongooseResolvers.count(),
  categoryConnection: CategoryTC.mongooseResolvers.connection(),
  categoryPagination: CategoryTC.mongooseResolvers.pagination(),
  businesses: CategoryTC.addRelation("businesses", {
    resolver: () => BusinessTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.businesses,
    },
    projection: { businesses: 1 },
  }),
};

const CategoryMutation = {
  categoryCreateOne: CategoryTC.mongooseResolvers.createOne(),
  categoryCreateMany: CategoryTC.mongooseResolvers.createMany(),
  categoryUpdateById: CategoryTC.mongooseResolvers.updateById(),
  categoryUpdateOne: CategoryTC.mongooseResolvers.updateOne(),
  categoryUpdateMany: CategoryTC.mongooseResolvers.updateMany(),
  categoryRemoveById: CategoryTC.mongooseResolvers.removeById(),
  categoryRemoveOne: CategoryTC.mongooseResolvers.removeOne(),
  categoryRemoveMany: CategoryTC.mongooseResolvers.removeMany(),
};

export { CategoryQuery, CategoryMutation };
