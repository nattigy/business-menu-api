import {TempBusinessTC} from "../models/tempBusiness";
import {UserTC} from "../models/user";

const TempBusinessQuery = {
  tempBusinessById: TempBusinessTC.getResolver("findById"),
  tempBusinessByIds: TempBusinessTC.getResolver("findByIds"),
  tempBusinessOne: TempBusinessTC.getResolver("findOne"),
  tempBusinessMany: TempBusinessTC.getResolver("findMany"),
  tempBusinessCount: TempBusinessTC.getResolver("count"),
  tempBusinessConnection: TempBusinessTC.getResolver("connection"),
  tempBusinessPagination: TempBusinessTC.getResolver("pagination"),
  owner: TempBusinessTC.addRelation("owner", {
    resolver: () => UserTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: {owner: 1},
  }),
};

const TempBusinessMutation = {
  tempBusinessCreateOne: TempBusinessTC.getResolver("createOne"),
  tempBusinessCreateMany: TempBusinessTC.getResolver("createMany"),
  tempBusinessUpdateById: TempBusinessTC.getResolver("updateById"),
  tempBusinessUpdateOne: TempBusinessTC.getResolver("updateOne"),
  tempBusinessUpdateMany: TempBusinessTC.getResolver("updateMany"),
  tempBusinessRemoveById: TempBusinessTC.getResolver("removeById"),
  tempBusinessRemoveOne: TempBusinessTC.getResolver("removeOne"),
  tempBusinessRemoveMany: TempBusinessTC.getResolver("removeMany"),
};

export {TempBusinessQuery, TempBusinessMutation};
