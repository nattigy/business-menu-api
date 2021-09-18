import {UserModel, UserTC} from "../../models/user";

const addUserCoupon = {
  name: "userAddCoupon",
  kind: "mutation",
  type: UserTC,
  args: {coupon: "MongoID", id: "MongoID"},
  resolve: async ({args}) => {
    await UserModel.updateOne(
      {_id: args.id},
      {$addToSet: {coupons: args.coupon}}
    ).catch((error) => error);
    return UserModel.findById(args.id);
  },
};

export default {
  addUserCoupon,
};
