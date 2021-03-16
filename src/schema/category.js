import { CategoryTC } from "../models/category";
import { BusinessTC } from "../models/business";

const CategoryQuery = {
  categoryById: CategoryTC.getResolver("findById"),
  categoryByIds: CategoryTC.getResolver("findByIds"),
  categoryOne: CategoryTC.getResolver("findOne"),
  categoryMany: CategoryTC.getResolver("findMany"),
  categoryCount: CategoryTC.getResolver("count"),
  categoryConnection: CategoryTC.getResolver("connection"),
  categoryPagination: CategoryTC.getResolver("pagination"),
  businesses: CategoryTC.addRelation("businesses", {
    resolver: () => BusinessTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.businesses,
    },
    projection: { businesses: 1 },
  }),
};

const CategoryMutation = {
  categoryCreateOne: CategoryTC.getResolver("createOne"),
  categoryCreateMany: CategoryTC.getResolver("createMany"),
  categoryUpdateById: CategoryTC.getResolver("updateById"),
  categoryUpdateOne: CategoryTC.getResolver("updateOne"),
  categoryUpdateMany: CategoryTC.getResolver("updateMany"),
  categoryRemoveById: CategoryTC.getResolver("removeById"),
  categoryRemoveOne: CategoryTC.getResolver("removeOne"),
  categoryRemoveMany: CategoryTC.getResolver("removeMany"),
};

export { CategoryQuery, CategoryMutation };
