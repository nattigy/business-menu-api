import {BusinessTC} from "../../models/business";
import {EventModel, EventTC} from "../../models/event";

import Resolvers from "./resolvers";
import {authMiddleware as middleware} from "../../middleware/authMiddleware";

for (const resolver in Resolvers) {
  EventTC.addResolver(Resolvers[resolver]);
}

const EventQuery = {
  eventById: EventTC.getResolver("findById",[middleware.isAuth, middleware.isAdmin]),
  eventByIds: EventTC.getResolver("findByIds",[middleware.isAuth, middleware.isAdmin]),
  eventOne: EventTC.getResolver("findOne",[middleware.isAuth, middleware.isAdmin]),
  eventMany: EventTC.getResolver("findMany",[middleware.isAuth, middleware.isAdmin]),
  eventOwner: EventTC.addRelation("owner", {
    resolver: () => BusinessTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: {owner: 1},
  }),
  eventIsLiked: EventTC.addFields({
    likeCount: {
      type: 'Int',
      resolve: (event) => event ? event.interestedUsers ? event.interestedUsers.length : 0 : 0,
    },
    isInterested: {
      type: 'Boolean',
      resolve: (event, _, {user}) => {
        const ev = EventModel.findById(event._id,{interestedUsers: 1});
        return ev.favoriteList.contains(user._id);
      },
    },
    interestedUsers: {
      type: '[MongoID]',
      resolve: () => []
    }
  }),
};

const EventMutation = {
  eventCreateOne: EventTC.getResolver("createOne",[middleware.isAuth, middleware.isAdmin]),
  eventCreateMany: EventTC.getResolver("createMany",[middleware.isAuth, middleware.isAdmin]),
  eventUpdateById: EventTC.getResolver("updateById",[middleware.isAuth, middleware.isAdmin]),
  eventUpdateOne: EventTC.getResolver("updateOne",[middleware.isAuth, middleware.isAdmin]),
  eventUpdateMany: EventTC.getResolver("updateMany",[middleware.isAuth, middleware.isAdmin]),
  eventRemoveById: EventTC.getResolver("removeById",[middleware.isAuth, middleware.isAdmin]),
  eventRemoveOne: EventTC.getResolver("removeOne",[middleware.isAuth, middleware.isAdmin]),
  eventRemoveMany: EventTC.getResolver("removeMany",[middleware.isAuth, middleware.isAdmin]),
  eventDeleteById: EventTC.getResolver("eventDeleteById",[middleware.isAuth, middleware.isAdmin]),
  eventLikeUnLike: EventTC.getResolver("eventLikeUnLike",[middleware.isAuth, middleware.isAdmin]),
};

export {EventQuery, EventMutation};
