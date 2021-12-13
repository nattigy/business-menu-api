import {MainCategoryListTC} from "../../models/mainCategoryList";
import {authMiddleware as middleware} from "../../middleware/authMiddleware";
import {CategoryTC} from "../../models/category";

const MainCategoryListTCQuery = {
  mainCategoryListById: MainCategoryListTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]),
  mainCategoryListByIds: MainCategoryListTC.getResolver("findByIds", [middleware.isAuth, middleware.isAdmin]),
  mainCategoryListOne: MainCategoryListTC.getResolver("findOne"),
  mainCategoryListMany: MainCategoryListTC.getResolver("findMany"),
  subCategories: MainCategoryListTC.addRelation("subCategories", {
    resolver: () => CategoryTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.subCategories,
    },
    projection: {subCategories: 1},
  }),
};

const MainCategoryListTCMutation = {
  mainCategoryListCreateOne: MainCategoryListTC.getResolver("createOne", [middleware.isAuth, middleware.isAdmin]),
  mainCategoryListCreateMany: MainCategoryListTC.getResolver("createMany", [middleware.isAuth, middleware.isAdmin]),
  mainCategoryListUpdateById: MainCategoryListTC.getResolver("updateById", [middleware.isAuth, middleware.isAdmin]),
  mainCategoryListUpdateOne: MainCategoryListTC.getResolver("updateOne", [middleware.isAuth, middleware.isAdmin]),
  mainCategoryListUpdateMany: MainCategoryListTC.getResolver("updateMany", [middleware.isAuth, middleware.isAdmin]),
  mainCategoryListRemoveById: MainCategoryListTC.getResolver("removeById", [middleware.isAuth, middleware.isAdmin]),
  mainCategoryListRemoveOne: MainCategoryListTC.getResolver("removeOne", [middleware.isAuth, middleware.isAdmin]),
  mainCategoryListRemoveMany: MainCategoryListTC.getResolver("removeMany", [middleware.isAuth, middleware.isAdmin]),
};

export {MainCategoryListTCQuery, MainCategoryListTCMutation};
