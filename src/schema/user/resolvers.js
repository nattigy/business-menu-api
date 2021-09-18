import {User, UserTC} from "../../models/user";

const addUserCoupon = {
  name: "userAddCoupon",
  kind: "mutation",
  type: UserTC,
  args: {coupon: "MongoID", id: "MongoID"},
  resolve: async ({args}) => {
    await User.updateOne(
      {_id: args.id},
      {$addToSet: {coupons: args.coupon}}
    ).catch((error) => error);
    return User.findById(args.id);
  },
};

const signUp = {
  name: "userSignUp",
  kind: "mutation",
  type: UserTC,
  args: {email: 'String', password: "String"},
  resolve: ({source, args, context}) => {
    console.log("here");
    console.log({
      source, args, context
    });
    console.log({
      authHeader: context.req.headers.authorization,
    });
  },
};

export default {
  addUserCoupon,
  signUp,
};
