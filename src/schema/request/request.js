import {RequestTC} from "../../models/request";

const RequestQuery = {
  requestById: RequestTC.getResolver("findById"),
  requestByIds: RequestTC.getResolver("findByIds"),
  requestOne: RequestTC.getResolver("findOne"),
  requestMany: RequestTC.getResolver("findMany"),
  requestCount: RequestTC.getResolver("count"),
  requestConnection: RequestTC.getResolver("connection"),
  requestPagination: RequestTC.getResolver("pagination"),
};

const RequestMutation = {
  requestCreateOne: RequestTC.getResolver("createOne"),
  requestCreateMany: RequestTC.getResolver("createMany"),
  requestUpdateById: RequestTC.getResolver("updateById"),
  requestUpdateOne: RequestTC.getResolver("updateOne"),
  requestUpdateMany: RequestTC.getResolver("updateMany"),
  requestRemoveById: RequestTC.getResolver("removeById"),
  requestRemoveOne: RequestTC.getResolver("removeOne"),
  requestRemoveMany: RequestTC.getResolver("removeMany"),
};

export {RequestQuery, RequestMutation};
