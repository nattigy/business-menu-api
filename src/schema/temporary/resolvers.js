import { TemporaryModel, TemporaryTC } from "../../models/business/temporary";
import { BusinessModel } from "../../models/business/business";
import { BusinessListModel } from "../../models/business/business-list";
import { UserModel } from "../../models/user/user";

const temporaryCreateOneCustom = {
  name: "temporaryCreateOneCustom",
  kind: "mutation",
  type: TemporaryTC,
  args: {
    businessName: "String!",
    phoneNumbers: ["String!"],
    location: "String!",
    locationDescription: "String",
    pictures: ["String!"],
    categories: ["String!"],
    searchIndex: ["String!"],
    categoryIndex: ["String"],
    claimed: "Boolean!",
    lng: "Float!",
    lat: "Float!",
  },
  resolve: async ({
    args: {
      businessName,
      phoneNumbers,
      claimed,
      location,
      locationDescription,
      pictures,
      categories,
      searchIndex,
      categoryIndex,
      lng,
      lat,
    },
    context: { user },
  }) => {
    let bizId = "";
    await TemporaryModel.create({
      businessName,
      phoneNumbers,
      phoneNumber: phoneNumbers,
      claimed,
      location,
      locationDescription,
      pictures,
      categories,
      searchIndex,
      categoryIndex,
      lng,
      lat,
      lngLat: {
        type: "Point",
        coordinates: [lng, lat],
      },
      owner: user._id,
      state: "NOT_VERIFIED",
    })
      .then(async (res) => {
        bizId = res._id;
        await UserModel.updateOne(
          { _id: user._id },
          { $addToSet: { unverifiedBusinesses: bizId } }
        );
      })
      .catch((error) => error);
    return TemporaryModel.findById(bizId);
  },
};

const temporaryVerifyById = {
  name: "temporaryVerifyById",
  kind: "mutation",
  type: TemporaryTC,
  args: {
    id: "String!",
  },
  resolve: async ({ args: { id } }) => {
    const temp = await TemporaryModel.findById(id);
    await BusinessModel.create({
      businessName: temp.businessName,
      phoneNumbers: temp.phoneNumbers,
      phoneNumber: temp.phoneNumbers,
      claimed: true,
      state: "ACTIVE",
      location: temp.location,
      locationDescription: temp.locationDescription,
      pictures: temp.pictures,
      categories: temp.categories,
      searchIndex: temp.searchIndex,
      categoryIndex: temp.categoryIndex,
      lng: temp.lng,
      lat: temp.lat,
      lngLat: temp.lngLat,
      owner: temp.owner,
    })
      .then(async (res) => {
        const bizId = res._id;
        await BusinessListModel.create({
          autocompleteTerm: temp.businessName.toLowerCase(),
        }).then(async () => {
          await UserModel.updateOne(
            { _id: temp.owner },
            { $addToSet: { businesses: bizId } },
            { $pull: { unverifiedBusinesses: id } }
          );
        });
      })
      .catch((error) => error);
    await TemporaryModel.findByIdAndDelete(id);
    return BusinessModel.findById(temp.businessId);
  },
};

const temporaryRemoveByIdCustom = {
  name: "temporaryRemoveByIdCustom",
  kind: "mutation",
  type: TemporaryTC,
  args: {
    id: "String!",
  },
  // resolve: async ({ args: { id }, context: { user } }) => {
  //   return TemporaryModel.findById("bizId");
  // },
};

export default {
  temporaryCreateOneCustom,
  temporaryRemoveByIdCustom,
  temporaryVerifyById,
};
