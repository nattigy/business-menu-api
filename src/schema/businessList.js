import {BusienssListTC} from "../models/businessList";

const BusinessListQuery = {
    businessListById: BusienssListTC.getResolver("findById"),
    businessListByIds: BusienssListTC.getResolver("findByIds"),
    businessListOne: BusienssListTC.getResolver("findOne"),
    businessListMany: BusienssListTC.getResolver("findMany"),
    businessListCount: BusienssListTC.getResolver("count"),
    businessListConnection: BusienssListTC.getResolver("connection"),
    businessListPagination: BusienssListTC.getResolver("pagination"),
};

const BusinessListMutation = {
    businessListCreateOne: BusienssListTC.getResolver("createOne"),
    businessListCreateMany: BusienssListTC.getResolver("createMany"),
    businessListUpdateById: BusienssListTC.getResolver("updateById"),
    businessListUpdateOne: BusienssListTC.getResolver("updateOne"),
    businessListUpdateMany: BusienssListTC.getResolver("updateMany"),
    businessListRemoveById: BusienssListTC.getResolver("removeById"),
    businessListRemoveOne: BusienssListTC.getResolver("removeOne"),
    businessListRemoveMany: BusienssListTC.getResolver("removeMany"),
};

export {BusinessListQuery, BusinessListMutation};
