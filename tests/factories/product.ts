import { datatype, lorem } from "faker";

import createFactory from "./common";

import Product from "database/models/product";

const productFactory = createFactory(Product, {
  price: datatype.number(20),
  name: lorem.words(5),
});

export default productFactory;
