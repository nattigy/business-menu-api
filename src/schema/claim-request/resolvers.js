import { BusinessModel, BusinessTC } from "../../models/business/business";
import { ClaimRequestModel, ClaimRequestTC } from "../../models/business/claim-request.js";
import { UserModel } from "../../models/user/user";
import { userService } from "../../utils/userService";

// Mutations

const createClaimRequest = {
  name: "createClaimRequest",
  kind: "mutation",
  type: ClaimRequestTC,
  args: {
    businessId: "String!",
    licensePicture: "String!",
    userIdPicture: "String!",
  },
  resolve: async ({
                    args: {
                      businessId,
                      licensePicture,
                      userIdPicture,
                    },
                    context: { accessToken },
                  }) => {
    const user = await userService.getUser(accessToken.replace("Bearer ", ""));
    return ClaimRequestModel.create({
      business: businessId,
      licensePicture,
      userIdPicture,
      user: user._id,
      status: "PENDING"
    }).then(async (res) => {
      await UserModel.findByIdAndUpdate(user._id, {
        $addToSet: { claimRequests: res._id },
      });
    });
  },
};

const approveClaimRequest = {
  name: "approveClaimRequest",
  kind: "mutation",
  type: BusinessTC,
  args: {
    requestId: "String!",
  },
  resolve: async ({ args: { requestId } }) => {
    const claimRequest = await ClaimRequestModel.findById(requestId);
    await BusinessModel.findByIdAndUpdate(claimRequest.business.toString(), {
      owner: claimRequest.user.toString(),
    });
    await UserModel.findByIdAndUpdate(claimRequest.user.toString(), {
      $pull: { claimRequests: requestId },
      $addToSet: { businesses: claimRequest.business.toString() },
    });
    claimRequest.status = "APPROVED";
    await claimRequest.save();
    return claimRequest;
  },
};

const cancelClaimRequest = {
  name: "cancelClaimRequest",
  kind: "mutation",
  type: BusinessTC,
  args: {
    requestId: "String!",
  },
  resolve: async ({ args: { requestId } }) => {
    const claimRequest = await ClaimRequestModel.findById(requestId);
    await UserModel.findByIdAndUpdate(claimRequest.user.toString(), {
      $pull: { claimRequests: requestId },
    });
    claimRequest.status = "CANCELED";
    await claimRequest.save();
    return claimRequest;
  },
};

export default {
  createClaimRequest,
  approveClaimRequest,
  cancelClaimRequest,
};
