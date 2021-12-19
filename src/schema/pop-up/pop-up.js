import { PopUpTC } from "../../models/events/pop-up";
import { authMiddleware as middleware } from "../../middleware/authMiddleware";

const PopUpQuery = {
  popUpById: PopUpTC.getResolver("findById", [middleware.isAuth, middleware.isAdmin]),
  popUpByIds: PopUpTC.getResolver("findByIds", [middleware.isAuth, middleware.isAdmin]),
  popUpOne: PopUpTC.getResolver("findOne"),
};

const PopUpMutation = {
  popUpCreateOne: PopUpTC.getResolver("createOne", [middleware.isAuth, middleware.isAdmin]),
  popUpUpdateById: PopUpTC.getResolver("updateById", [middleware.isAuth, middleware.isAdmin]),
  popUpUpdateOne: PopUpTC.getResolver("updateOne", [middleware.isAuth, middleware.isAdmin]),
  popUpRemoveById: PopUpTC.getResolver("removeById", [middleware.isAuth, middleware.isAdmin]),
  popUpRemoveOne: PopUpTC.getResolver("removeOne", [middleware.isAuth, middleware.isAdmin]),
};

export { PopUpQuery, PopUpMutation };
