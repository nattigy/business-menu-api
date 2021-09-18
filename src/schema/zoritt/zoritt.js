import {ZorittTC} from "../../models/zoritt";

const ZorittQuery = {
  zorittById: ZorittTC.getResolver("findById"),
  zorittByIds: ZorittTC.getResolver("findByIds"),
  zorittOne: ZorittTC.getResolver("findOne"),
};

const ZorittMutation = {
  zorittCreateOne: ZorittTC.getResolver("createOne"),
  zorittUpdateById: ZorittTC.getResolver("updateById"),
  zorittUpdateOne: ZorittTC.getResolver("updateOne"),
  zorittRemoveById: ZorittTC.getResolver("removeById"),
  zorittRemoveOne: ZorittTC.getResolver("removeOne"),
};

export {ZorittQuery, ZorittMutation};
