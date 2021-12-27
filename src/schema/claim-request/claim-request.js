import { ClaimRequestTC } from "../../models/business/claim-request.js";

import Resolvers from "./resolvers";
import { authMiddleware as middleware } from "../../middleware/authMiddleware";
import { UserTC } from "../../models/user/user.js";
import { BusinessTC } from "../../models/business/business.js";

for (const resolver in Resolvers) {
  ClaimRequestTC.addResolver(Resolvers[resolver]);
}

const ClaimRequestQuery = {
  claimRequestById: ClaimRequestTC.getResolver("findById", [middleware.isAuth]),
  claimRequestByIds: ClaimRequestTC.getResolver("findByIds", [middleware.isAuth, middleware.isAdmin]),
  claimRequestMany: ClaimRequestTC.getResolver("findMany", [middleware.isAuth, middleware.isAdmin]),
  claimRequestPagination: ClaimRequestTC.getResolver("pagination", [middleware.isAuth, middleware.isAdmin]),
  business: ClaimRequestTC.addRelation("business", {
    resolver: () => BusinessTC.getResolver("findById", [middleware.isAuth]),
    prepareArgs: {
      _id: (source) => source.business,
    },
    projection: { business: 1 },
  }),
  userOwner: ClaimRequestTC.addRelation("user", {
    resolver: () => UserTC.getResolver("findById", [middleware.isAuth]),
    prepareArgs: {
      _id: (source) => source.user,
    },
    projection: { user: 1 },
  }),
};

const ClaimRequestMutation = {
  createClaimRequest: ClaimRequestTC.getResolver("createClaimRequest", [middleware.isAuth, middleware.isOwner]),
  approveClaimRequest: ClaimRequestTC.getResolver("approveClaimRequest", [middleware.isAuth, middleware.isAdmin]),
  cancelClaimRequest: ClaimRequestTC.getResolver("cancelClaimRequest", [middleware.isAuth, middleware.isAdmin]),
};

export { ClaimRequestQuery, ClaimRequestMutation };
