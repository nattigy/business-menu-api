import { TemporaryTC } from "../../models/business/temporary";
import { CategoryTC } from "../../models/category/category";
import { UserTC } from "../../models/user/user";

import { authMiddleware as middleware } from "../../middleware/authMiddleware";
import Resolvers from "./resolvers";

for (const resolver in Resolvers) {
  TemporaryTC.addResolver(Resolvers[resolver]);
}

const TemporaryQuery = {
  temporaryById: TemporaryTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]),
  temporaryByIds: TemporaryTC.getResolver("findByIds", [middleware.isAuth, middleware.isAdmin]),
  temporaryOne: TemporaryTC.getResolver("findOne", [middleware.isAuth, middleware.isAdmin]),
  temporaryMany: TemporaryTC.getResolver("findMany", [middleware.isAuth, middleware.isAdmin]),
  temporaryPagination: TemporaryTC.getResolver("pagination", [middleware.isAuth, middleware.isAdmin]),
  temporaryCategories: TemporaryTC.addRelation("categories", {
    resolver: () => CategoryTC.getResolver("findByIds"), prepareArgs: {
      _ids: (source) => source.categories,
    }, projection: { categories: 1 },
  }),
  temporaryOwner: TemporaryTC.addRelation("owner", {
    resolver: () => UserTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]), prepareArgs: {
      _id: (source) => source.owner,
    }, projection: { owner: 1 },
  }),
};

const TemporaryMutation = {
  temporaryCreateOne: TemporaryTC.getResolver("createOne", [middleware.isAuth, middleware.isAdmin]),
  temporaryCreateOneCustom: TemporaryTC.getResolver("temporaryCreateOneCustom", [middleware.isAuth, middleware.isOwner]),
  temporaryVerifyById: TemporaryTC.getResolver("temporaryVerifyById", [middleware.isAuth, middleware.isOwner]),
  temporaryCreateMany: TemporaryTC.getResolver("createMany", [middleware.isAuth, middleware.isAdmin]),
  temporaryUpdateById: TemporaryTC.getResolver("updateById", [middleware.isAuth, middleware.isAdmin]),
  temporaryUpdateOne: TemporaryTC.getResolver("updateOne", [middleware.isAuth, middleware.isAdmin]),
  temporaryUpdateMany: TemporaryTC.getResolver("updateMany", [middleware.isAuth, middleware.isAdmin]),
  temporaryRemoveById: TemporaryTC.getResolver("removeById", [middleware.isAuth, middleware.isAdmin]),
  temporaryRemoveOne: TemporaryTC.getResolver("removeOne", [middleware.isAuth, middleware.isAdmin]),
  temporaryRemoveMany: TemporaryTC.getResolver("removeMany", [middleware.isAuth, middleware.isAdmin]), // temporaryRemoveByIdCustom: TemporaryTC.getResolver("temporaryRemoveByIdCustom", [middleware.isAuth, middleware.isAdmin]),
};

export { TemporaryQuery, TemporaryMutation };
