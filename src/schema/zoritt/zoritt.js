import {ZorittTC} from "../../models/zoritt";
import {authMiddleware as middleware} from "../../middleware/authMiddleware";

const ZorittQuery = {
  zorittById: ZorittTC.getResolver("findById",[middleware.isAuth, middleware.isAdmin]),
  zorittByIds: ZorittTC.getResolver("findByIds",[middleware.isAuth, middleware.isAdmin]),
  zorittOne: ZorittTC.getResolver("findOne",[middleware.isGuest]),
};

const ZorittMutation = {
  zorittCreateOne: ZorittTC.getResolver("createOne",[middleware.isAuth, middleware.isAdmin]),
  zorittUpdateById: ZorittTC.getResolver("updateById",[middleware.isAuth, middleware.isAdmin]),
  zorittUpdateOne: ZorittTC.getResolver("updateOne",[middleware.isAuth, middleware.isAdmin]),
  zorittRemoveById: ZorittTC.getResolver("removeById",[middleware.isAuth, middleware.isAdmin]),
  zorittRemoveOne: ZorittTC.getResolver("removeOne",[middleware.isAuth, middleware.isAdmin]),
};

export {ZorittQuery, ZorittMutation};
