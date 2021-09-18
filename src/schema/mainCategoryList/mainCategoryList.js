import {MainCategoryListTC} from "../../models/mainCategoryList";

const MainCategoryListTCQuery = {
  mainCategoryListById: MainCategoryListTC.getResolver("findById"),
  mainCategoryListByIds: MainCategoryListTC.getResolver("findByIds"),
  mainCategoryListOne: MainCategoryListTC.getResolver("findOne"),
  mainCategoryListMany: MainCategoryListTC.getResolver("findMany"),
  mainCategoryListCount: MainCategoryListTC.getResolver("count"),
  mainCategoryListConnection: MainCategoryListTC.getResolver("connection"),
  mainCategoryListPagination: MainCategoryListTC.getResolver("pagination"),
};

const MainCategoryListTCMutation = {
  mainCategoryListCreateOne: MainCategoryListTC.getResolver("createOne"),
  mainCategoryListCreateMany: MainCategoryListTC.getResolver("createMany"),
  mainCategoryListUpdateById: MainCategoryListTC.getResolver("updateById"),
  mainCategoryListUpdateOne: MainCategoryListTC.getResolver("updateOne"),
  mainCategoryListUpdateMany: MainCategoryListTC.getResolver("updateMany"),
  mainCategoryListRemoveById: MainCategoryListTC.getResolver("removeById"),
  mainCategoryListRemoveOne: MainCategoryListTC.getResolver("removeOne"),
  mainCategoryListRemoveMany: MainCategoryListTC.getResolver("removeMany"),
};

export {MainCategoryListTCQuery, MainCategoryListTCMutation};
