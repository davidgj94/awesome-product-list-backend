import { model, Schema, Model, Document, Types } from "mongoose";

import { validateRef, ModelDocument } from "./utils";

import { ProductDocument } from "./product";

interface IProductOrder {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  products: IProductOrder[];
  createdAt: number;
}

interface OrderModel extends Model<IOrder> {}

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

const OrderSchema = new Schema<IOrder, OrderModel>(
  {
    products: [{ type: ProductOrderSchema, min: 1 }],
  },
  { timestamps: true }
);

const Order = model<IOrder, OrderModel>("Order", OrderSchema);

export default Order;
