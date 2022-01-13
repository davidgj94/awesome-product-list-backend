import { datatype, lorem } from "faker";

import createFactory from "./common";
import restaurantFactory from "./restaurant";

import Product from "database/models/product";

const productFactory = createFactory(Product, async () => ({
  price: datatype.number(20),
  name: lorem.words(5),
  restaurant: (await restaurantFactory())._id,
}));

export default productFactory;
