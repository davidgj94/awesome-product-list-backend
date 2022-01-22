import moment from "moment";

import config from "config";
import { ok, err } from "core/result";
import { AwaitedAsyncFunc } from "core/types";
import { ServiceResult } from "./utils";

import { Order, Product, User } from "database/models";
import { UpdateVolumeFunc } from "database/models/product";

const updateVolumeFunc: UpdateVolumeFunc = (newVolume, oldVolume) =>
  config.VOLUME_UPDATE_RATE * newVolume +
  (1 - config.VOLUME_UPDATE_RATE) * oldVolume;

export const updateProductsVolume = async () => {
  const endTime = new Date();
  const startTime = moment(endTime)
    .subtract(config.VOLUME_INTERVAL_HOURS, "hour")
    .toDate();
  const productsVolume = await Order.computeProductsVolume(startTime, endTime);
  for (const { _id: productId, volume } of productsVolume) {
    await (
      await Product.findById(productId)
    ).updateProductVolume(volume, updateVolumeFunc);
  }
};

export const toggleFavorites = async (
  userEmail: string,
  productId: string
): Promise<ServiceResult<string[], "USER_NOT_FOUND" | "VALIDATION_ERROR">> => {
  const user = await User.findOne({ email: userEmail });
  if (!user)
    return err({
      errType: "USER_NOT_FOUND",
      error: new Error("User not found"),
    });
  user.toggleFav(productId);
  try {
    await user.save();
    return ok(user.favProducts.map((id) => id.toString()));
  } catch (error) {
    return err({
      errType: "VALIDATION_ERROR",
      error,
    });
  }
};

export const listTrendyProducts = async (
  skip: number,
  limit: number
): Promise<
  ServiceResult<AwaitedAsyncFunc<typeof Product.findTrendyProducts>>
> => {
  try {
    const trendyProducts = await Product.findTrendyProducts(
      moment().subtract(config.VOLUME_INTERVAL_HOURS, "hours").toDate(),
      skip,
      limit
    );
    return ok(trendyProducts);
  } catch (error) {
    return err({ errType: "ERROR", error });
  }
};
