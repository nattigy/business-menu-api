import admin from "../config/firebase-config";
import role from "../utils/roles";

const authMiddleware = {
  isAuth: (resolve, source, args, context, info) => {
    const {user} = context;

    if (!user) {
      return Promise.reject(new Error('You must be authorized.'));
    }

    return resolve(source, args, context, info);
  },
  isGuest: (resolve, source, args, context, info) => {
    const {user} = context;

    if (user) {
      return Promise.reject(new Error('You have already authorized.'));
    }

    return resolve(source, args, context, info);
  },
  isAdmin: (resolve, source, args, context, info) => {
    const {user} = context;

    if (!user.roles.includes(role.ADMIN)) {
      return Promise.reject(new Error('Access denied.'));
    }

    return resolve(source, args, context, info);
  },
  isOwner: (resolve, source, args, context, info) => {
    const {user} = context;

    if (!user.roles.includes(role.OWNER) || !user.roles.includes(role.ADMIN)) {
      return Promise.reject(new Error('Access denied.'));
    }

    return resolve(source, args, context, info);
  },
  isPhoneVerified: (resolve, source, args, context, info) => {
    const {phoneVerification} = context;
    let phoneNumber = "";
    admin
      .auth()
      .verifyIdToken(phoneVerification)
      .then((decodedToken) => {
        phoneNumber = decodedToken.phoneNumber;
      })
      .catch(() => Promise.reject(new Error('Error happened!')));
    if (phoneNumber === "") {
      return Promise.reject(new Error('Error happened!'));
    }
    context.phoneNumber = phoneNumber;
    return resolve(source, args, context, info);
  },
  isValidated: (resolve, source, args, context, info) => {
    const {user} = context;

    if (user._id.toString() !== args._id.toString()) {
      return Promise.reject(new Error('Access denied.'));
    }

    return resolve(source, args, context, info);
  },
  isVerified: (resolve, source, args, context, info) => {
    const {
      user: {
        account: {
          verification: {verified}
        }
      }
    } = context;

    if (!verified) {
      return Promise.reject(new Error('You must be verified.'));
    }
    return resolve(source, args, context, info);
  },
  isUnverified: (resolve, source, args, context, info) => {
    const {
      user: {
        account: {
          verification: {verified}
        }
      }
    } = context;

    if (verified) {
      return Promise.reject(new Error('You have already verified.'));
    }
    return resolve(source, args, context, info);
  }
};

export {authMiddleware};
