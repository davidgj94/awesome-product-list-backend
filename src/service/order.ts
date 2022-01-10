import Order from "database/models/order";
import { OrderDTO } from "controller/order";

export const createOrder = async (orderDTO: OrderDTO) => {
  return await new Order({ ...orderDTO }).save();
};
