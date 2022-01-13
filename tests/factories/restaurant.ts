import { lorem } from "faker";

import createFactory from "./common";
import Restaurant from "database/models/restaurant";

const restaurantFactory = createFactory(Restaurant, async () => ({
  location: lorem.word(5),
  name: lorem.word(5),
}));

export default restaurantFactory;
