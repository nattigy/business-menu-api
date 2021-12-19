import { CouponModel, CouponTC } from "../../models/subscription/coupon";

const createOneCustom = {
  name: "createOneCustom", kind: "mutation", type: CouponTC, args: {
    taken: "Boolean", sold: "Boolean", type: "String", value: "Float", duration: "Float", subscription: "String",
  }, resolve: async ({
                       args: { taken, sold, type, value, duration, subscription }, context: { user },
                     }) => {
    const coupon = await CouponModel.create({
      taken, sold, type, value, duration, subscription, owner: user._id,
    }).catch((error) => error);
    return CouponModel.findById(coupon._id);
  },
};

export default {
  createOneCustom,
};
