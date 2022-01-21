import jwt from "jsonwebtoken";
import moment from "moment";

import config from "config";
import { UserDocument } from "database/models/user";

export interface RequestUser {
  email: string;
}

const getRequestUser = (user: Partial<UserDocument>): RequestUser => ({
  email: user.email,
});

export const createToken = (user: Partial<UserDocument>) =>
  jwt.sign(getRequestUser(user), config.JWT_SECRET, {
    expiresIn: moment.duration(config.JWT_EXPIRES_DAYS, "days").asSeconds(),
  });
