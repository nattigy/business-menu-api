"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventMutation = exports.EventQuery = undefined;

var _business = require("../models/business");

var _event = require("../models/event");

var _user = require("../models/user");

_event.EventTC.addResolver({
  name: "getEventsLoggedIn",
  kind: "query",
  type: _event.EventTC.getResolver("findMany").getType(),
  args: {
    "user_id": "String",
    limit: "Int",
    fromDate: "String",
    sort: "String"
  },
  resolve: async ({
    args
  }) => {
    let events = await _event.Event.find({
      "createdAt": {
        $gte: args.fromDate
      },
      "endDate": {
        $gte: new Date().toISOString()
      }
    }).sort({
      "startDate": "asce",
      "createdAt": args.sort
    }).limit(args.limit);
    events = events.map(e => ({ ...e._doc,
      isInterested: e._doc.interestedUsers.includes(args.user_id)
    }));
    return events;
  }
});

const EventQuery = {
  eventById: _event.EventTC.getResolver("findById"),
  eventByIds: _event.EventTC.getResolver("findByIds"),
  eventOne: _event.EventTC.getResolver("findOne"),
  eventMany: _event.EventTC.getResolver("findMany"),
  getEventsLoggedIn: _event.EventTC.getResolver("getEventsLoggedIn"),
  eventCount: _event.EventTC.getResolver("count"),
  eventConnection: _event.EventTC.getResolver("connection"),
  eventPagination: _event.EventTC.getResolver("pagination"),
  interestedUsers: _event.EventTC.addRelation("interestedUsers", {
    resolver: () => _user.UserTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: source => source.interestedUsers
    },
    projection: {
      interestedUsers: 1
    }
  }),
  owner: _event.EventTC.addRelation("owner", {
    resolver: () => _business.BusinessTC.getResolver("findById"),
    prepareArgs: {
      _id: source => source.owner
    },
    projection: {
      owner: 1
    }
  })
};

_event.EventTC.addFields({
  interestedCount: {
    type: 'Int',
    resolve: event => event ? event.interestedUsers ? event.interestedUsers.length : 0 : 0
  }
});

_event.EventTC.addResolver({
  name: "eventLike",
  kind: "mutation",
  type: _event.EventTC,
  args: {
    user_id: "String",
    event_id: "String"
  },
  resolve: async ({
    args
  }) => {
    await _event.Event.updateOne({
      _id: args.event_id
    }, {
      $addToSet: {
        interestedUsers: args.user_id
      }
    }).then(async () => {
      await _user.User.updateOne({
        _id: args.user_id
      }, {
        $addToSet: {
          interestedInEvents: args.event_id
        }
      });
    }).catch(error => error);
    return _event.Event.findById(args.event_id);
  }
});

_event.EventTC.addResolver({
  name: "eventUnlike",
  kind: "mutation",
  type: _event.EventTC,
  args: {
    "user_id": "String",
    event_id: "String"
  },
  resolve: async ({
    args
  }) => {
    await _event.Event.updateOne({
      _id: args.event_id
    }, {
      $pull: {
        interestedUsers: args.user_id
      }
    }).then(async () => {
      await _user.User.updateOne({
        _id: args.user_id
      }, {
        $pull: {
          interestedInEvents: args.event_id
        }
      });
    }).catch(error => error);
    return _event.Event.findById(args.event_id);
  }
});

const EventMutation = {
  eventCreateOne: _event.EventTC.getResolver("createOne"),
  eventCreateMany: _event.EventTC.getResolver("createMany"),
  eventUpdateById: _event.EventTC.getResolver("updateById"),
  eventLike: _event.EventTC.getResolver("eventLike"),
  eventUnlike: _event.EventTC.getResolver("eventUnlike"),
  eventUpdateOne: _event.EventTC.getResolver("updateOne"),
  eventUpdateMany: _event.EventTC.getResolver("updateMany"),
  eventRemoveById: _event.EventTC.getResolver("removeById"),
  eventRemoveOne: _event.EventTC.getResolver("removeOne"),
  eventRemoveMany: _event.EventTC.getResolver("removeMany")
};
exports.EventQuery = EventQuery;
exports.EventMutation = EventMutation;