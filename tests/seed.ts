import moment from "moment";

import { initDatabase } from "../src/database";
import productFactory from "./factories/product";
import orderFactory from "./factories/order";

(async function () {
  await initDatabase(3);
  const product1 = await productFactory();

  const product2 = await productFactory();

  const product3 = await productFactory();

  const firstOrderDate = new Date();
  const secondOrderDate = moment(firstOrderDate).add(1, "hour").toDate();
  const thirdOrderDate = moment(secondOrderDate).add(1, "hour").toDate();

  await orderFactory({
    products: [
      { product: product1._id, quantity: 5 },
      { product: product2._id, quantity: 1 },
      { product: product3._id, quantity: 6 },
    ],
    createdAt: firstOrderDate,
  });

  await orderFactory({
    products: [
      { product: product1._id, quantity: 5 },
      { product: product2._id, quantity: 1 },
    ],
    createdAt: secondOrderDate,
  });

  await orderFactory({
    products: [{ product: product2._id, quantity: 1 }],
    createdAt: thirdOrderDate,
  });
})();
