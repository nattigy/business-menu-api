import {BranchTC} from "../models/branch";
import {BusinessTC} from "../models/business";

const BranchQuery = {
  branchById: BranchTC.getResolver("findById"),
  branchByIds: BranchTC.getResolver("findByIds"),
  branchOne: BranchTC.getResolver("findOne"),
  branchMany: BranchTC.getResolver("findMany"),
  branchCount: BranchTC.getResolver("count"),
  branchConnection: BranchTC.getResolver("connection"),
  branchPagination: BranchTC.getResolver("pagination"),
  owner: BranchTC.addRelation("owner", {
    resolver: () => BusinessTC.getResolver("findById"),
    prepareArgs: {
      _id: (source) => source.owner,
    },
    projection: {owner: 1},
  }),
};

const BranchMutation = {
  branchCreateOne: BranchTC.getResolver("createOne"),
  branchCreateMany: BranchTC.getResolver("createMany"),
  branchUpdateById: BranchTC.getResolver("updateById"),
  branchUpdateOne: BranchTC.getResolver("updateOne"),
  branchUpdateMany: BranchTC.getResolver("updateMany"),
  branchRemoveById: BranchTC.getResolver("removeById"),
  branchRemoveOne: BranchTC.getResolver("removeOne"),
  branchRemoveMany: BranchTC.getResolver("removeMany"),
};

export {BranchQuery, BranchMutation};
