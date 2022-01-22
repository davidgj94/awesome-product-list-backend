import { query } from "express-validator";

import { controllerWrapper, ServerError, StatusCode } from "./utils";
import { RequestUser } from "auth/utils";
import { toggleFavorites, listTrendyProducts } from "service/product";

export const favProductController = controllerWrapper<
  {},
  {},
  { favProducts: string[] },
  RequestUser
>([], async (req) => {
  const { id: productId } = req.params;
  const { email } = req.user;
  const serviceResult = await toggleFavorites(email, productId);
  if (serviceResult.isOk())
    return {
      statusCode: StatusCode.SUCCESS,
      value: { favProducts: serviceResult.value },
    };
  const { error } = serviceResult;
  if (error.errType == "USER_NOT_FOUND")
    throw new ServerError(StatusCode.NOT_FOUND, error.error.message);
  if (error.errType == "VALIDATION_ERROR")
    throw new ServerError(StatusCode.BAD_REQUEST, error.error.message);
});

export const listTrendyProductsController = controllerWrapper<{
  skip?: number;
  limit?: number;
}>(
  [query("skip").isNumeric().toInt(), query("limit").isNumeric().toInt()],
  async (req) => {
    const { skip = 0, limit = 10 } = req.query;
    const serviceResult = await listTrendyProducts(skip, limit);
    if (serviceResult.isErr())
      throw new ServerError(StatusCode.INTERNAL_SERVER_ERROR);
    return { statusCode: StatusCode.SUCCESS, value: serviceResult.value };
  }
);
