import { RequestTC } from "../../models/subscription/request.js";
import { authMiddleware as middleware } from "../../middleware/authMiddleware";

const RequestQuery = {
  requestById: RequestTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]),
  requestByIds: RequestTC.getResolver("findByIds", [middleware.isAuth, middleware.isAdmin]),
  requestOne: RequestTC.getResolver("findOne", [middleware.isAuth, middleware.isAdmin]),
  requestMany: RequestTC.getResolver("findMany", [middleware.isAuth, middleware.isAdmin]),
};

const RequestMutation = {
  requestCreateOne: RequestTC.getResolver("createOne", [middleware.isAuth, middleware.isAdmin]),
  requestCreateMany: RequestTC.getResolver("createMany", [middleware.isAuth, middleware.isAdmin]),
  requestUpdateById: RequestTC.getResolver("updateById", [middleware.isAuth, middleware.isAdmin]),
  requestUpdateOne: RequestTC.getResolver("updateOne", [middleware.isAuth, middleware.isAdmin]),
  requestUpdateMany: RequestTC.getResolver("updateMany", [middleware.isAuth, middleware.isAdmin]),
  requestRemoveById: RequestTC.getResolver("removeById", [middleware.isAuth, middleware.isAdmin]),
  requestRemoveOne: RequestTC.getResolver("removeOne", [middleware.isAuth, middleware.isAdmin]),
  requestRemoveMany: RequestTC.getResolver("removeMany", [middleware.isAuth, middleware.isAdmin]),
};

export { RequestQuery, RequestMutation };
