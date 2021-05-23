import {BusinessTC} from "../models/business";
import {EventTC, Event} from "../models/event";
import {User, UserTC} from "../models/user";

EventTC.addResolver({
    name: "getEventsLoggedIn",
    kind: "query",
    type: EventTC.getResolver("findMany").getType(),
    args: {"user_id": "String", limit: "Int", fromDate: "String", sort: "String"},
    resolve: async ({args}) => {
        let events = await Event.find({
            "createdAt": {$gte: args.fromDate},
            "endDate": {$gte: new Date().toISOString()}
        })
            .sort({
                "startDate": "asce",
                "createdAt": args.sort
            }).limit(args.limit);
        events = events.map(e => ({...e._doc, isInterested: e._doc.interestedUsers.includes(args.user_id)}));
        return events;
    },
});

const EventQuery = {
    eventById: EventTC.getResolver("findById"),
    eventByIds: EventTC.getResolver("findByIds"),
    eventOne: EventTC.getResolver("findOne"),
    eventMany: EventTC.getResolver("findMany"),
    getEventsLoggedIn: EventTC.getResolver("getEventsLoggedIn"),
    eventCount: EventTC.getResolver("count"),
    eventConnection: EventTC.getResolver("connection"),
    eventPagination: EventTC.getResolver("pagination"),
    interestedUsers: EventTC.addRelation("interestedUsers", {
        resolver: () => UserTC.getResolver("findByIds"),
        prepareArgs: {
            _ids: (source) => source.interestedUsers,
        },
        projection: {interestedUsers: 1},
    }),
    owner: EventTC.addRelation("owner", {
        resolver: () => BusinessTC.getResolver("findById"),
        prepareArgs: {
            _id: (source) => source.owner,
        },
        projection: {owner: 1},
    }),
};

EventTC.addFields({
    interestedCount: {
        type: 'Int',
        resolve: (event) => event ? event.interestedUsers ? event.interestedUsers.length : 0 : 0,
    },
});

EventTC.addResolver({
    name: "eventLike",
    kind: "mutation",
    type: EventTC,
    args: {user_id: "String", event_id: "String"},
    resolve: async ({args}) => {
        await Event.updateOne(
            {_id: args.event_id},
            {$addToSet: {interestedUsers: args.user_id}}
        ).then(async () => {
            await User.updateOne(
                {_id: args.user_id},
                {$addToSet: {interestedInEvents: args.event_id}}
            );
        }).catch((error) => error);
        return Event.findById(args.event_id);
    },
});

EventTC.addResolver({
    name: "eventUnlike",
    kind: "mutation",
    type: EventTC,
    args: {"user_id": "String", event_id: "String"},
    resolve: async ({args}) => {
        await Event.updateOne(
            {_id: args.event_id},
            {$pull: {interestedUsers: args.user_id}}
        ).then(async () => {
            await User.updateOne(
                {_id: args.user_id},
                {$pull: {interestedInEvents: args.event_id}}
            );
        }).catch((error) => error);
        return Event.findById(args.event_id);
    },
});

const EventMutation = {
    eventCreateOne: EventTC.getResolver("createOne"),
    eventCreateMany: EventTC.getResolver("createMany"),
    eventUpdateById: EventTC.getResolver("updateById"),
    eventLike: EventTC.getResolver("eventLike"),
    eventUnlike: EventTC.getResolver("eventUnlike"),
    eventUpdateOne: EventTC.getResolver("updateOne"),
    eventUpdateMany: EventTC.getResolver("updateMany"),
    eventRemoveById: EventTC.getResolver("removeById"),
    eventRemoveOne: EventTC.getResolver("removeOne"),
    eventRemoveMany: EventTC.getResolver("removeMany"),
};

export {EventQuery, EventMutation};
