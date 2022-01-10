import createFactory from "./common";

import Order from "database/models/order";

const orderFactory = createFactory(Order, {});

export default orderFactory;
