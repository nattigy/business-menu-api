import { MainSubscriptionTC } from "../../models/subscription/main-subscription";

import { authMiddleware as middleware } from "../../middleware/authMiddleware";

const MainSubscriptionQuery = {
  mainSubscriptionById: MainSubscriptionTC.getResolver("findById"),
  mainSubscriptionByIds: MainSubscriptionTC.getResolver("findByIds"),
  mainSubscriptionOne: MainSubscriptionTC.getResolver("findOne"),
  mainSubscriptionMany: MainSubscriptionTC.getResolver("findMany"),
  mainSubscriptionPagination: MainSubscriptionTC.getResolver("pagination"),
};

const MainSubscriptionMutation = {
  mainSubscriptionCreateOne: MainSubscriptionTC.getResolver("createOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  mainSubscriptionCreateMany: MainSubscriptionTC.getResolver("createMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  mainSubscriptionUpdateById: MainSubscriptionTC.getResolver("updateById", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  mainSubscriptionUpdateOne: MainSubscriptionTC.getResolver("updateOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  mainSubscriptionUpdateMany: MainSubscriptionTC.getResolver("updateMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  mainSubscriptionRemoveById: MainSubscriptionTC.getResolver("removeById", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  mainSubscriptionRemoveOne: MainSubscriptionTC.getResolver("removeOne", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
  mainSubscriptionRemoveMany: MainSubscriptionTC.getResolver("removeMany", [
    middleware.isAuth,
    middleware.isAdmin,
  ]),
};

export { MainSubscriptionQuery, MainSubscriptionMutation };
