import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import moment from 'moment';

import {UserModel, UserTC} from "../../models/user";
import {userService} from '../../utils/userService';
import roles from "../../utils/roles";
// import redis from '../../config/redis-config';

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

const user = {
  name: 'user',
  type: UserTC,
  resolve: async ({context: {accessToken}}) => {
    const user = await userService.getUser(accessToken.replace("Bearer ", ""));
    return UserModel.findById(user._id);
  }
};

const signIn = {
  name: 'signIn',
  type: 'AccessToken!',
  args: {
    email: 'String!',
    password: 'String!'
  },
  resolve: async ({args: {email, password}}) => {
    try {
      const user = await UserModel.emailExist(email);
      if (!user) {
        return Promise.reject(new Error('User not found.'));
      }

      const comparePassword = await user.comparePassword(password);
      if (!comparePassword) {
        return Promise.reject(new Error('Password is incorrect.'));
      }

      const accessToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          // phoneNumber: user.phoneNumber,
          roles: user.roles,
        }, process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION
        },
      );

      return {accessToken, roles: user.roles, user};
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const ownerSignIn = {
  name: 'ownerSignIn',
  type: 'AccessToken!',
  args: {
    phoneNumber: 'String!',
    password: 'String!'
  },
  resolve: async ({args: {phoneNumber, password}}) => {
    try {
      const user = await UserModel.phoneNumberExist(phoneNumber);
      if (!user) {
        return Promise.reject(new Error('User not found.'));
      }

      const comparePassword = await user.comparePassword(password.toString());
      if (!comparePassword) {
        return Promise.reject(new Error('Password is incorrect.'));
      }

      const accessToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          roles: user.roles,
        }, process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION
        },
      );

      return {accessToken, roles: user.roles, user};
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const userSignUp = {
  name: 'userSignUp',
  type: 'AccessToken!',
  args: {
    email: 'String!',
    password: 'String!',
    firstName: 'String!',
    middleName: 'String!',
    lastName: 'String!',
    phoneNumber: 'String!',
  },
  resolve: async ({args: {email, password, firstName, middleName, lastName, phoneNumber}}) => {
    try {
      let user = await UserModel.emailExist(email);
      if (user) {
        return Promise.reject(new Error('Email has already been taken.'));
      }

      const hash = bcrypt.hashSync(password, 10);

      user = await new UserModel({
        email,
        firstName,
        middleName,
        lastName,
        // phoneNumber,
        password: hash,
        roles: [roles.NORMAL]
      }).save();

      const accessToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          // phoneNumber: user.phoneNumber,
        }, process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION
        },
      );

      await userService.verifyRequest(user);

      // userMail.verifyRequest(user, token);

      return {accessToken, roles: user.roles, user};
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const ownerSignUp = {
  name: 'ownerSignUp',
  type: 'AccessToken!',
  args: {
    email: 'String!',
    password: 'String!',
    firstName: 'String!',
    middleName: 'String!',
    lastName: 'String!',
  },
  resolve: async ({args: {email, password, firstName, middleName, lastName}, context: {phoneNumber, phoneVerification}}) => {
    try {
      let user = await UserModel.phoneNumberExist(phoneNumber);

      if (user) {
        return Promise.reject(new Error('Phone Number has already been taken.'));
      }

      user = await UserModel.emailExist(email);
      if (user) {
        return Promise.reject(new Error('Email has already been taken.'));
      }

      const hash = bcrypt.hashSync(password, 10);

      user = await new UserModel({
        email,
        firstName,
        middleName,
        lastName,
        phoneNumber,
        password: hash,
        roles: [roles.OWNER],
        account: {
          phoneVerification: {
            verified: true,
            token: phoneVerification,
          },
        },
      }).save();

      const accessToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        }, process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION
        },
      );

      await userService.verifyRequest(user);

      // userMail.verifyRequest(user, token);

      return {accessToken, roles: user.roles, user};
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const adminSignUp = {
  name: 'adminSignUp',
  type: 'AccessToken!',
  args: {
    email: 'String!',
    password: 'String!',
    firstName: 'String!',
    middleName: 'String!',
    lastName: 'String!',
  },
  resolve: async ({args: {email, password, firstName, middleName, lastName}, context: {phoneNumber}}) => {
    try {
      let user = await UserModel.emailExist(email);
      if (user) {
        return Promise.reject(new Error('Email has already been taken.'));
      }

      const hash = bcrypt.hashSync(password, 10);

      user = await new UserModel({
        email,
        firstName,
        middleName,
        lastName,
        phoneNumber,
        password: hash,
        roles: [roles.ADMIN]
      }).save();

      const accessToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        }, process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION
        },
      );

      await userService.verifyRequest(user);

      // userMail.verifyRequest(user, token);

      return {accessToken};
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

// const logout = {
//   name: 'logout',
//   type: 'Succeed!',
//   resolve: async ({context: {user, accessToken}}) => {
//     try {
//       await redis.set(`expiredToken:${accessToken}`, user._id, 'EX', process.env.REDIS_TOKEN_EXPIRY);
//
//       return {succeed: true};
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   }
// };

const verifyRequest = {
  name: 'verifyRequest',
  type: 'Succeed!',
  resolve: async ({context: {user}}) => {
    try {
      await userService.verifyRequest(user);

      // userMail.verifyRequest(user, token);

      return {succeed: true};
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const verify = {
  name: 'verify',
  type: 'AccessToken!',
  args: {token: 'String!'},
  resolve: async ({args: {token}}) => {
    try {
      const user = await UserModel.findOne({
        'account.verification.token': token
      });
      if (!user) {
        return Promise.reject(new Error('Access Token is not valid or has expired.'));
      }

      user.set({
        account: {
          verification: {
            verified: true,
            token: null,
            expiresIn: null
          }
        }
      });

      await user.save();

      const accessToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      });

      // userMail.verify(user);

      return {accessToken};
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const resetPassword = {
  name: 'resetPassword',
  type: 'Succeed!',
  args: {email: 'String!'},
  resolve: async ({args: {email}}) => {
    try {
      const user = await UserModel.findOne({email});
      if (!user) {
        return Promise.reject(new Error('User not found.'));
      }

      const token = crypto.randomBytes(48, (err, buffer) => buffer.toString('hex'));
      const expiresIn = moment().add(7, 'days');

      user.set({
        account: {
          resetPassword: {
            token,
            expiresIn
          }
        }
      });

      await user.save();

      // userMail.resetPassword(user, token);

      return {succeed: true};
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const newPassword = {
  name: 'newPassword',
  type: 'AccessToken!',
  args: {token: 'String!', newPassword: 'String!'},
  resolve: async ({args: {token, newPassword}}) => {
    try {
      const user = await UserModel.findOne({
        'account.resetPassword.token': token
      });
      if (!user) {
        return Promise.reject(new Error('Access Token is not valid or has expired.'));
      }

      const hash = bcrypt.hashSync(newPassword, 10);

      user.set({
        password: hash,
        account: {
          resetPassword: {
            token: null,
            expiresIn: null
          }
        }
      });

      await user.save();

      const accessToken = await jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      });

      return {accessToken};
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const changePassword = {
  name: 'changePassword',
  type: 'Succeed!',
  args: {currentPassword: 'String!', newPassword: 'String!'},
  resolve: async ({args: {currentPassword, newPassword}, context: {user}}) => {
    try {
      const comparePassword = await user.comparePassword(currentPassword);
      if (!comparePassword) {
        return Promise.reject(new Error('Current password is incorrect.'));
      }

      const hash = bcrypt.hashSync(newPassword, 10);

      user.set({password: hash});

      await user.save();

      return {succeed: true};
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const updateUser = {
  name: 'updateUser',
  type: 'User!',
  args: {email: 'String!', firstName: 'String!', lastName: 'String!'},
  resolve: async ({args: {email, firstName, lastName}, context: {user}}) => {
    try {
      let {
          account: {
            verification: {verified}
          }
        } = user,
        verifyRequest = false;

      if (user.email !== email) {
        const userExist = await UserModel.findOne({email});
        if (userExist) {
          return Promise.reject(new Error('Email has already been taken.'));
        }
        verified = false;
        verifyRequest = true;
      }

      user.set({
        email,
        firstName,
        lastName,
        account: {
          verification: {
            verified
          }
        }
      });

      await user.save();

      if (verifyRequest) {
        await userService.verifyRequest(user);

        // userMail.verifyRequest(user, token);
      }

      return user;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

// const switchLocale = {
//   name: 'switchLocale',
//   type: 'User!',
//   args: {locale: 'Locale!'},
//   resolve: async ({args: {locale}, context: {user}}) => {
//     try {
//       user.set({locale});
//
//       await user.save();
//
//       return user;
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   }
// };

export default {
  addUserCoupon,
  user,
  signIn,
  ownerSignIn,
  userSignUp,
  ownerSignUp,
  adminSignUp,
  // logout,
  verifyRequest,
  verify,
  resetPassword,
  newPassword,
  changePassword,
  updateUser,
  // switchLocale,
};
