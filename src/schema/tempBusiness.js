import {TempBusiness, TempBusinessTC} from "../models/tempBusiness";
import {User, UserTC} from "../models/user";
import {BusinessTC} from "../models/business";
import {BusinessList} from "../models/businessList";

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

TempBusinessTC.addResolver({
  name: "businessCreateOneCustom",
  kind: "mutation",
  type: TempBusinessTC,
  args: {
    user_id: "String",
    businessName: "String",
    phoneNumber: "String",
    location: "String",
    locationDescription: "String",
    pictures: ["String"],
    categories: ["String"],
    searchIndex: ["String"],
    categoryIndex: ["String"],
    lng: "Float",
    lat: "Float",
  },
  resolve: async ({args}) => {
    let bizId = "";
    await TempBusiness.create(
      {
        businessName: args.businessName,
        phoneNumber: args.phoneNumber,
        location: args.location,
        locationDescription: args.locationDescription,
        pictures: args.pictures,
        categories: args.categories,
        searchIndex: args.searchIndex,
        categoryIndex: args.categoryIndex,
        lng: args.lng,
        lat: args.lat,
        owner: args.user_id,
      }
    )
      .then(async (res) => {
        bizId = res._id;
        await BusinessList.create(
          {
            autocompleteTerm: args.businessName.toLowerCase()
          }
        )
          .then(async () => {
            await User.updateOne(
              {_id: args.user_id},
              {$addToSet: {businesses: bizId}}
            );
          })
          .catch((error) => error);
      }).catch((error) => error);
    return TempBusiness.findById(bizId);
  },
});

const TempBusinessMutation = {
  businessCreateOneCustom: BusinessTC.getResolver("businessCreateOneCustom"),
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
