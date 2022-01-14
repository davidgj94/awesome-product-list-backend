import moment from "moment";

import config from "config";

import { Order, Product } from "database/models";
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
