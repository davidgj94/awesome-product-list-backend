import { model, Schema, Model, Document, Types, SchemaTypes } from "mongoose";
import { validateRef, ModelDocument } from "./utils";
import { RestaurantDocument } from "./restaurant";

interface IProduct {
  name: string;
  price: number;
  restaurant: Types.ObjectId;
  lastOrderDate: Date;
  volume: number;
}

interface ProductModel extends Model<IProduct, {}, ProductInstanceMethods> {
  findTrendyProducts(
    timeLimit: Date,
    skip?: number,
    limit?: number
  ): PopulatedProductDocument[];
}

const averageVolume = (
  newVolume: number,
  oldVolume: number,
  alfa = 0.9
): number => alfa * newVolume + (1 - alfa) * oldVolume;

interface ProductInstanceMethods {
  updateProductVolume(
    newVolume: number,
    updateFunc?: typeof averageVolume
  ): void;
}

export type ProductDocument = ModelDocument<IProduct>;
type PopulatedProductDocument = Omit<ProductDocument, "restaurant"> & {
  restaurant: RestaurantDocument;
};

const ProductSchema = new Schema<IProduct, ProductModel>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    validate: validateRef("Restaurant"),
  },
  lastOrderDate: { type: Date, required: false },
  volume: { type: Number, default: 0 },
});

ProductSchema.index({ lastOrderDate: -1, volume: 1 });

ProductSchema.methods.updateProductVolume = function (
  this: ProductDocument,
  newVolume: number,
  updateFunc: typeof averageVolume = averageVolume
) {
  this.volume = updateFunc(newVolume, this.volume);
};

ProductSchema.statics.findTrendyProducts = async function (
  this,
  timeLimit: Date,
  skip: number = 0,
  limit: number = 20
) {
  return await this.find({ lastOrderDate: { $gte: timeLimit } })
    .skip(skip)
    .limit(limit)
    .sort({ volume: -1 })
    .populate("restaurant");
};

const Product = model<IProduct, ProductModel>("Product", ProductSchema);

export default Product;
