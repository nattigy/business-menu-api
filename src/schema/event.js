import { BusinessTC } from "../models/business";
import { EventTC } from "../models/event";

const EventQuery = {
  eventById: EventTC.getResolver("findById"),
  eventByIds: EventTC.getResolver("findByIds"),
  eventOne: EventTC.getResolver("findOne"),
  eventMany: EventTC.getResolver("findMany"),
  eventCount: EventTC.getResolver("count"),
  eventConnection: EventTC.getResolver("connection"),
  eventPagination: EventTC.getResolver("pagination"),
  businesse: EventTC.addRelation("businesses", {
    resolver: () => BusinessTC.getResolver("findById"),
    prepareArgs: {
      _ids: (source) => source.business,
    },
    projection: { business: 1 },
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
};

export { EventQuery, EventMutation };
