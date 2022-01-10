import createFactory from "./common";
import Restaurant from "database/models/restaurant";

const restaurantFactory = createFactory(Restaurant, {
  location: "Granada",
  name: "ASDF",
});

export default restaurantFactory;
