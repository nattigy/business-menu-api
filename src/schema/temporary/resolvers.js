import {TemporaryModel, TemporaryTC} from "../../models/temporary";

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

export default {temporaryCreateOneCustom};
