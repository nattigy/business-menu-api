import {TempBusiness, TempBusinessTC} from "../models/tempBusiness";
import {User, UserTC} from "../models/user";
import {Business} from "../models/business";
import {BusinessList} from "../models/businessList";
import {CategoryTC} from "../models/category";
import {Branch} from "../models/branch";

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
  businessCategories: TempBusinessTC.addRelation("categories", {
    resolver: () => CategoryTC.getResolver("findByIds"),
    prepareArgs: {
      _ids: (source) => source.categories,
    },
    projection: {categories: 1},
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
        await Branch.create({
          branchName: args.businessName,
          phoneNumber: args.phoneNumber,
          location: args.location,
          locationDescription: args.locationDescription,
          lng: args.lng,
          lat: args.lat,
          state: "ACTIVE",
          pictures: args.pictures,
          owner: bizId
        }).then(async (bb) => {
          await Business.findByIdAndUpdate(bizId, {
            branches: [bb._id]
          });
        }).catch((error) => error);
      }).catch((error) => error);
    return TempBusiness.findById(bizId);
  },
});

const TempBusinessMutation = {
  businessCreateOneCustom: TempBusinessTC.getResolver("businessCreateOneCustom"),
  tempBusinessUpdateById: TempBusinessTC.getResolver("updateById"),
  tempBusinessRemoveById: TempBusinessTC.getResolver("removeById"),
  tempBusinessRemoveMany: TempBusinessTC.getResolver("removeMany"),
};

export {TempBusinessQuery, TempBusinessMutation};
