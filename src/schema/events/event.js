import { BusinessTC } from "../../models/business/business";
import { EventTC } from "../../models/events/event";

import Resolvers from "./resolvers";
import { authMiddleware as middleware } from "../../middleware/authMiddleware";

for (const resolver in Resolvers) {
  EventTC.addResolver(Resolvers[resolver]);
}

const EventQuery = {
  eventById: EventTC.getResolver("findById"),
  eventByIds: EventTC.getResolver("findByIds", [middleware.isAuth, middleware.isAdmin]),
  eventOne: EventTC.getResolver("findOne"),
  eventMany: EventTC.getResolver("findMany"),
  eventPagination: EventTC.getResolver("pagination"),
  eventOwner: EventTC.addRelation("owner", {
    resolver: () => BusinessTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: { owner: 1 },
  }),
  eventIsLiked: EventTC.addFields({
    likeCount: {
      type: "Int",
      resolve: (event) => event?.interestedUsers ? event.interestedUsers.length : 0,
    },
    isInterested: {
      type: "Boolean",
      resolve: (event, _, { user }) => event?.interestedUsers.indexOf(user?._id) >= 0,
    },
    interestedUsers: {
      type: "[MongoID]",
      resolve: () => [],
    },
  }),
};

const EventMutation = {
  eventCreateOne: EventTC.getResolver("createOne", [middleware.isAuth]),
  eventCreateMany: EventTC.getResolver("createMany", [middleware.isAuth, middleware.isAdmin]),
  eventUpdateById: EventTC.getResolver("updateById", [middleware.isAuth]),
  eventUpdateOne: EventTC.getResolver("updateOne", [middleware.isAuth, middleware.isAdmin]),
  eventUpdateMany: EventTC.getResolver("updateMany", [middleware.isAuth, middleware.isAdmin]),
  eventRemoveById: EventTC.getResolver("removeById", [middleware.isAuth]),
  eventRemoveOne: EventTC.getResolver("removeOne", [middleware.isAuth, middleware.isAdmin]),
  eventRemoveMany: EventTC.getResolver("removeMany", [middleware.isAuth, middleware.isAdmin]),
  eventDeleteById: EventTC.getResolver("eventDeleteById", [middleware.isAuth]),
  eventLikeUnLike: EventTC.getResolver("eventLikeUnLike", [middleware.isAuth]),
};

export { EventQuery, EventMutation };
