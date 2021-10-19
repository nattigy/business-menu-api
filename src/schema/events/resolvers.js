import {EventModel, EventTC} from "../../models/event";
import {BusinessModel} from "../../models/business";
import {UserModel} from "../../models/user";
import {userService} from "../../utils/userService";

// Mutations

const eventLikeUnLike = {
  name: "eventLikeUnLike",
  kind: "mutation",
  type: EventTC,
  args: {eventId: "String"},
  resolve: async ({args: {eventId}, context: {accessToken}}) => {
    const user = await userService.getUser(accessToken.replace("Bearer ", ""));
    const userId = user._id;
    const {interestedUsers} = await EventModel.findById(
      eventId, {interestedUsers: 1},
    );

    if (interestedUsers.indexOf(userId) >= 0) {
      await EventModel.updateOne(
        {_id: eventId},
        {$pull: {interestedUsers: userId}}
      ).then(async () => {
        await UserModel.updateOne(
          {_id: userId},
          {$pull: {interestedInEvents: eventId}}
        );
      }).catch((error) => error);
    } else {
      await EventModel.updateOne(
        {_id: eventId},
        {$addToSet: {interestedUsers: userId}}
      ).then(async () => {
        await UserModel.updateOne(
          {_id: userId},
          {$addToSet: {interestedInEvents: eventId}}
        );
      }).catch((error) => error);
    }
    return EventModel.findById(eventId);
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
