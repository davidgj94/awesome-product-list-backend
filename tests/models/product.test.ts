import moment from "moment";

import Product from "database/models/product";

import productFactory from "../factories/product";

const now = Date.now();
const substractNow = (minutes: number) =>
  moment(now).subtract(minutes, "minute").toDate();

describe("Products tests", () => {
  it("returns trendy products sorted by volume", async () => {
    const product1 = await productFactory({
      lastOrderDate: substractNow(1),
      volume: 10,
    });

    const product2 = await productFactory({
      lastOrderDate: substractNow(2),
      volume: 20,
    });

    await productFactory({
      lastOrderDate: substractNow(5),
      volume: 40,
    });

    const product3 = await productFactory({
      lastOrderDate: substractNow(3),
      volume: 5,
    });

    const trendyProducts = await Product.findTrendyProducts(substractNow(4));
    const outputIds = trendyProducts.map((product) => product._id);
    const expectedIds = [product2, product1, product3].map(
      (product) => product._id
    );

    expect(outputIds).toEqual(expectedIds);
  });
});
