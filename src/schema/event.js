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
