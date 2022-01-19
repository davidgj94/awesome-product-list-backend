import faker from "faker";
import { Types } from "mongoose";

import createFactory from "./common";
import productFactory from "./product";
import { User } from "database/models";

const userFactory = createFactory(User, async () => ({
  email: faker.internet.email(),
  password: faker.internet.password(20),
  favProducts: await Promise.all(
    new Array(3).fill(0).map(async () => (await productFactory())._id)
  ),
}));

export default userFactory;
