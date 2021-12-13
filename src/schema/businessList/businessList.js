import {BusinessListTC} from "../../models/businessList";
import {authMiddleware as middleware} from "../../middleware/authMiddleware";

const BusinessListQuery = {
  businessListById: BusinessListTC.getResolver("findById",[middleware.isAuth, middleware.isAdmin]),
  businessListByIds: BusinessListTC.getResolver("findByIds",[middleware.isAuth, middleware.isAdmin]),
  businessListOne: BusinessListTC.getResolver("findOne",[middleware.isAuth, middleware.isAdmin]),
  businessListMany: BusinessListTC.getResolver("findMany"),
};

const BusinessListMutation = {
  businessListCreateOne: BusinessListTC.getResolver("createOne",[middleware.isAuth, middleware.isAdmin]),
  businessListCreateMany: BusinessListTC.getResolver("createMany",[middleware.isAuth, middleware.isAdmin]),
  businessListUpdateById: BusinessListTC.getResolver("updateById",[middleware.isAuth, middleware.isAdmin]),
  businessListUpdateOne: BusinessListTC.getResolver("updateOne",[middleware.isAuth, middleware.isAdmin]),
  businessListUpdateMany: BusinessListTC.getResolver("updateMany",[middleware.isAuth, middleware.isAdmin]),
  businessListRemoveById: BusinessListTC.getResolver("removeById",[middleware.isAuth, middleware.isAdmin]),
  businessListRemoveOne: BusinessListTC.getResolver("removeOne",[middleware.isAuth, middleware.isAdmin]),
  businessListRemoveMany: BusinessListTC.getResolver("removeMany",[middleware.isAuth, middleware.isAdmin]),
};

export {BusinessListQuery, BusinessListMutation};
