import {BusinessListTC} from "../models/businessList";

const BusinessListQuery = {
  businessListById: BusinessListTC.getResolver("findById"),
  businessListByIds: BusinessListTC.getResolver("findByIds"),
  businessListOne: BusinessListTC.getResolver("findOne"),
  businessListMany: BusinessListTC.getResolver("findMany"),
  businessListCount: BusinessListTC.getResolver("count"),
  businessListConnection: BusinessListTC.getResolver("connection"),
  businessListPagination: BusinessListTC.getResolver("pagination"),
};

const BusinessListMutation = {
  businessListCreateOne: BusinessListTC.getResolver("createOne"),
  businessListCreateMany: BusinessListTC.getResolver("createMany"),
  businessListUpdateById: BusinessListTC.getResolver("updateById"),
  businessListUpdateOne: BusinessListTC.getResolver("updateOne"),
  businessListUpdateMany: BusinessListTC.getResolver("updateMany"),
  businessListRemoveById: BusinessListTC.getResolver("removeById"),
  businessListRemoveOne: BusinessListTC.getResolver("removeOne"),
  businessListRemoveMany: BusinessListTC.getResolver("removeMany"),
};

export {BusinessListQuery, BusinessListMutation};
