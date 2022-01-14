import moment from "moment";

import { Order } from "database/models";
import { OrdersAggregationResult } from "database/models/order";

import productFactory from "../factories/product";
import restaurantFactory from "../factories/restaurant";
import orderFactory from "tests/factories/order";

const sortProductsVolume = (a, b) => a.volume - b.volume;

let product1Result: OrdersAggregationResult;
let product2Result: OrdersAggregationResult;
let product3Result: OrdersAggregationResult;

let firstOrderDate;
let secondOrderDate;
let thirdOrderDate;

describe("Orders tests", () => {
  beforeAll(async () => {
    const restaurant = await restaurantFactory();

    const product1 = await productFactory({
      restaurant: restaurant._id,
    });

    const product2 = await productFactory({
      restaurant: restaurant._id,
    });

    const product3 = await productFactory({
      restaurant: restaurant._id,
    });

    firstOrderDate = new Date();
    secondOrderDate = moment(firstOrderDate).add(1, "hour").toDate();
    thirdOrderDate = moment(secondOrderDate).add(1, "hour").toDate();

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

    product1Result = {
      _id: product1._id,
      volume: 10,
      lastOrderDate: secondOrderDate,
    };
    product2Result = {
      _id: product2._id,
      volume: 3,
      lastOrderDate: thirdOrderDate,
    };
    product3Result = {
      _id: product3._id,
      volume: 6,
      lastOrderDate: firstOrderDate,
    };
  });

  it("computes products volume", async () => {
    const startTime = moment(firstOrderDate).subtract(1, "minute").toDate();
    const endTime = moment(thirdOrderDate).add(1, "minute").toDate();

    const productsVolume = await Order.computeProductsVolume(
      startTime,
      endTime
    );

    expect(productsVolume.sort(sortProductsVolume)).toEqual(
      [product1Result, product2Result, product3Result].sort(sortProductsVolume)
    );
  });

  it("discards orders outside time range", async () => {
    const startTime = moment(thirdOrderDate).add(1, "minute").toDate();
    const endTime = moment(thirdOrderDate).add(2, "minute").toDate();

    const productsVolume = await Order.computeProductsVolume(
      startTime,
      endTime
    );

    expect(productsVolume).toEqual([]);
  });
});
