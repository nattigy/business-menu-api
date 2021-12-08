import {TemporaryModel, TemporaryTC} from "../../models/temporary";
import {BusinessModel} from "../../models/business";
import {BusinessListModel} from "../../models/businessList";

const temporaryCreateOneCustom = {
  name: "temporaryCreateOneCustom",
  kind: "mutation",
  type: TemporaryTC,
  args: {
    id: "String!",
    businessName: "String!",
    phoneNumbers: "[String!]!",
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
  resolve: async (
    {
      args: {
        id,
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
      }, context: {user}
    }) => {
    let bizId = "";
    await TemporaryModel.create(
      {
        businessId: id,
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
          coordinates: [lng, lat]
        },
        owner: user._id,
        state: "NOT_VERIFIED"
      }
    )
      .then(async (res) => {
        bizId = res._id;
      }).catch((error) => error);
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
  resolve: async (
    {
      args: {id}
    }) => {
    const temp = await TemporaryModel.findById(id);
    await BusinessModel.findByIdAndUpdate(
      temp.businessId,
      {
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
      }
    )
      .then(async () => {
        await BusinessListModel.create(
          {
            autocompleteTerm: temp.businessName.toLowerCase()
          }
        );
      }).catch((error) => error);
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
  resolve: async (
    {
      args: {
        id
      }, context: {user}
    }) => {

    return TemporaryModel.findById("bizId");
  },
};

export default {
  temporaryCreateOneCustom,
  temporaryRemoveByIdCustom,
  temporaryVerifyById,
};
