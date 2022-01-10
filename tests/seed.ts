import { Types } from "mongoose";

import { initDatabase } from "../src/database";
import productFactory from "./factories/product";
import orderFactory from "./factories/order";

(async function () {
  await initDatabase(3);
  const product = await productFactory();
  await orderFactory({
    products: [{ product: product._id, quantity: 2 }],
  });
})();
