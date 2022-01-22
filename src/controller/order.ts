import { controllerWrapper, ServerError, StatusCode } from "./utils";

import { createOrder } from "service/order";

export interface OrderDTO {
  products: { product: string; quantity: number }[];
}

export const createOrderController = controllerWrapper<{}, OrderDTO, {}>(
  [],
  async (req) => {
    const result = await createOrder(req.body);
    if (result.isErr()) {
      const error = result.error;
      throw new ServerError(StatusCode.BAD_REQUEST, error.error.message);
    }
    return { statusCode: StatusCode.SUCCESS, value: result.value };
  }
);
