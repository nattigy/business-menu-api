import crypto from 'crypto';
import moment from 'moment';
import jwt from "jsonwebtoken";

const userService = {
  verifyRequest: async user => {
    const token = crypto.randomBytes(48, (err, buffer) => buffer.toString('hex'));
    const expiresIn = moment().add(7, 'days');
    user.set({
      account: {
        verification: {
          token,
          expiresIn
        }
      }
    });
    await user.save();
    return token;
  },
  getUser: token => {
    try {
      if (token) {
        return jwt.verify(token, process.env.JWT_SECRET);
      }
      return null;
    } catch (error) {
      return null;
    }
  },
};

export {userService};
