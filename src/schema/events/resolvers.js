import {EventModel, EventTC} from "../../models/event";
import {BusinessModel} from "../../models/business";
import {UserModel} from "../../models/user";

// Mutations

const eventLikeUnLike = {
  name: "eventLikeUnLike",
  kind: "mutation",
  type: EventTC,
  args: {user_id: "String", event_id: "String"},
  resolve: async ({args: {user_id, event_id}}) => {
    const {interestedUsers} = await EventModel.findById(
      event_id, {interestedUsers: 1},
    );

    if (interestedUsers.contains(user_id)) {
      await EventModel.updateOne(
        {_id: event_id},
        {$pull: {interestedUsers: user_id}}
      ).then(async () => {
        await UserModel.updateOne(
          {_id: user_id},
          {$pull: {interestedInEvents: event_id}}
        );
      }).catch((error) => error);
    } else {
      await EventModel.updateOne(
        {_id: event_id},
        {$addToSet: {interestedUsers: user_id}}
      ).then(async () => {
        await UserModel.updateOne(
          {_id: user_id},
          {$addToSet: {interestedInEvents: event_id}}
        );
      }).catch((error) => error);
    }
    return EventModel.findById(event_id);
  },
};

const eventDeleteById = {
  name: "eventDeleteById",
  kind: "mutation",
  type: EventTC.getResolver("removeById"),
  args: {event_id: "String", owner: "String"},
  resolve: async ({args: {event_id, owner}}) => {
    await EventModel.remove(
      {_id: event_id},
      async () => {
        await BusinessModel.updateOne(
          {_id: owner},
          {$pull: {events: event_id}}
        );
      }
    ).catch((error) => error);
    return event_id;
  },
};

export default {eventLikeUnLike, eventDeleteById};
