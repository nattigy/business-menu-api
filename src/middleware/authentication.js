import jwt from "jsonwebtoken";

// import redis from "../config/redis-config";
import { UserModel } from "../models/user";

const authentication = async (req, res, next) => {
  try {
    const {
      headers: { authorization },
    } = req;
    if (!authorization) {
      return next();
    }

    const accessToken = authorization.split(" ")[1];

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!decoded) {
      return next();
    }

    // const isExpired = await redis.get(`expiredToken:${accessToken}`);
    // if (isExpired) {
    //   return next();
    // }

    if (decoded.exp * 1000 < Date.now()) {
      return next();
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return next();
    }

    Object.assign(req, {
      user,
      accessToken,
    });

    return next();
  } catch (error) {
    return next();
  }
};

export { authentication };
