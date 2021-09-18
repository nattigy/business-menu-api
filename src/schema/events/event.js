import {BusinessTC} from "../../models/business";
import {EventTC} from "../../models/event";

import Resolvers from "./resolvers";

for (const resolver in Resolvers) {
  EventTC.addResolver(Resolvers[resolver]);
}

const EventQuery = {
  eventById: EventTC.getResolver("findById"),
  eventByIds: EventTC.getResolver("findByIds"),
  eventOne: EventTC.getResolver("findOne"),
  eventMany: EventTC.getResolver("findMany"),
  owner: EventTC.addRelation("owner", {
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
      resolve: (source, _, context) => {
        // get user id => context.req.headers.authorization
        return false;
      },
    },
    interestedUsers: {
      type: '[MongoID]',
      resolve: () => []
    }
  }),
};

const EventMutation = {
  eventCreateOne: EventTC.getResolver("createOne"),
  eventCreateMany: EventTC.getResolver("createMany"),
  eventUpdateById: EventTC.getResolver("updateById"),
  eventUpdateOne: EventTC.getResolver("updateOne"),
  eventUpdateMany: EventTC.getResolver("updateMany"),
  eventRemoveById: EventTC.getResolver("removeById"),
  eventRemoveOne: EventTC.getResolver("removeOne"),
  eventRemoveMany: EventTC.getResolver("removeMany"),
  eventDeleteById: EventTC.getResolver("eventDeleteById"),
  eventLikeUnLike: EventTC.getResolver("eventLikeUnLike"),
};

export {EventQuery, EventMutation};
