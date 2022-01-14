import { model, Schema, Model, Document, Types } from "mongoose";

import { validateRef, ModelDocument } from "./utils";

interface IProductOrder {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  products: IProductOrder[];
  createdAt: Date;
}

export type OrdersAggregationResult = {
  _id: Types.ObjectId;
  volume: number;
  lastOrderDate: Date;
};

interface OrderModel extends Model<IOrder> {
  computeProductsVolume(
    startTime: Date,
    endTime: Date
  ): OrdersAggregationResult[];
}

export type OrderDocument = ModelDocument<IOrder>;

const ProductOrderSchema = new Schema<IProductOrder>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      validate: validateRef("Product"),
    },
    quantity: { type: Number, min: 1, default: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder, OrderModel>({
  products: [{ type: ProductOrderSchema, min: 1 }],
  createdAt: { type: Date, default: () => new Date() },
});

OrderSchema.statics.computeProductsVolume = async function (
  this,
  startTime: Date,
  endTime: Date
) {
  const productsVolume = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startTime, $lte: endTime },
      },
    },
    {
      $unwind: "$products",
    },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$products.product",
        volume: { $sum: "$products.quantity" },
        lastOrderDate: { $last: "$createdAt" },
      },
    },
  ]);

  return productsVolume as OrdersAggregationResult[];
};

const Order = model<IOrder, OrderModel>("Order", OrderSchema);

export default Order;
