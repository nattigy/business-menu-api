import { CategoryTC } from "../../models/category/category";
import { authMiddleware as middleware } from "../../middleware/authMiddleware";

const CategoryQuery = {
  categoryById: CategoryTC.getResolver("findById"),
  categoryByIds: CategoryTC.getResolver("findByIds"),
  categoryOne: CategoryTC.getResolver("findOne"),
  categoryMany: CategoryTC.getResolver("findMany"),
};

const CategoryMutation = {
  categoryCreateOne: CategoryTC.getResolver("createOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  categoryCreateMany: CategoryTC.getResolver("createMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  categoryUpdateById: CategoryTC.getResolver("updateById", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  categoryUpdateOne: CategoryTC.getResolver("updateOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  categoryUpdateMany: CategoryTC.getResolver("updateMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  categoryRemoveById: CategoryTC.getResolver("removeById", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  categoryRemoveOne: CategoryTC.getResolver("removeOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  categoryRemoveMany: CategoryTC.getResolver("removeMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
};

export { CategoryQuery, CategoryMutation };
