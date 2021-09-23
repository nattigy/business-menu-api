import {CategoryTC} from "../../models/category";
import {authMiddleware as middleware} from "../../middleware/authMiddleware";

const CategoryQuery = {
  categoryById: CategoryTC.getResolver("findById",[middleware.isGuest]),
  categoryByIds: CategoryTC.getResolver("findByIds",[middleware.isGuest]),
  categoryOne: CategoryTC.getResolver("findOne",[middleware.isGuest]),
  categoryMany: CategoryTC.getResolver("findMany",[middleware.isGuest]),
};

const CategoryMutation = {
  categoryCreateOne: CategoryTC.getResolver("createOne",[middleware.isAuth, middleware.isAdmin]),
  categoryCreateMany: CategoryTC.getResolver("createMany",[middleware.isAuth, middleware.isAdmin]),
  categoryUpdateById: CategoryTC.getResolver("updateById",[middleware.isAuth, middleware.isAdmin]),
  categoryUpdateOne: CategoryTC.getResolver("updateOne",[middleware.isAuth, middleware.isAdmin]),
  categoryUpdateMany: CategoryTC.getResolver("updateMany",[middleware.isAuth, middleware.isAdmin]),
  categoryRemoveById: CategoryTC.getResolver("removeById",[middleware.isAuth, middleware.isAdmin]),
  categoryRemoveOne: CategoryTC.getResolver("removeOne",[middleware.isAuth, middleware.isAdmin]),
  categoryRemoveMany: CategoryTC.getResolver("removeMany",[middleware.isAuth, middleware.isAdmin]),
};

export {CategoryQuery, CategoryMutation};
