import jwt from "jsonwebtoken";
import moment from "moment";

import config from "config";
import { UserDocument } from "database/models/user";

export const createToken = (user: Partial<UserDocument>) =>
  jwt.sign(
    {
      email: user.email,
    },
    config.JWT_SECRET,
    { expiresIn: moment.duration(config.JWT_EXPIRES_DAYS, "days").asSeconds() }
  );
