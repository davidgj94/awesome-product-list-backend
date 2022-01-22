import { ok, err } from "core/result";

import Order from "database/models/order";
import { OrderDTO } from "controller/order";

import { ServiceResult } from "./utils";

export const createOrder = async (
  orderDTO: OrderDTO
): Promise<ServiceResult<{}, "VALIDATION_ERROR">> => {
  try {
    const order = new Order({ ...orderDTO });
    await order.save();
    return ok(order);
  } catch (error) {
    return err({ error, errType: "VALIDATION_ERROR" });
  }
};
