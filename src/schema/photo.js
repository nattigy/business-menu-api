import { PhotoTC } from "../models/photo";

const PhotoQuery = {
  photoById: PhotoTC.getResolver("findById"),
  photoByIds: PhotoTC.getResolver("findByIds"),
  photoOne: PhotoTC.getResolver("findOne"),
  photoMany: PhotoTC.getResolver("findMany"),
  photoCount: PhotoTC.getResolver("count"),
  photoConnection: PhotoTC.getResolver("connection"),
  photoPagination: PhotoTC.getResolver("pagination"),
};

const PhotoMutation = {
  photoCreateOne: PhotoTC.getResolver("createOne"),
  photoCreateMany: PhotoTC.getResolver("createMany"),
  photoUpdateById: PhotoTC.getResolver("updateById"),
  photoUpdateOne: PhotoTC.getResolver("updateOne"),
  photoUpdateMany: PhotoTC.getResolver("updateMany"),
  photoRemoveById: PhotoTC.getResolver("removeById"),
  photoRemoveOne: PhotoTC.getResolver("removeOne"),
  photoRemoveMany: PhotoTC.getResolver("removeMany"),
};

export { PhotoQuery, PhotoMutation };
