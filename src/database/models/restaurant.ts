import { model, Schema } from "mongoose";
import { ModelDocument } from "./utils";

interface IRestaurant {
  name: string;
  location: string;
}

export type RestaurantDocument = ModelDocument<IRestaurant>;

const RestaurantSchema = new Schema<IRestaurant>({
  name: String,
  location: String,
});

const Restaurant = model("Restaurant", RestaurantSchema);

export default Restaurant;
