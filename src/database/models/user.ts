import { model, Schema, Model, Document, Types } from "mongoose";
import { hashSync, compareSync } from "bcryptjs";

import { validateRef, ModelDocument } from "./utils";

interface IUser {
  email: string;
  password: string;
  favProducts: Types.ObjectId[];
}

interface UserModel extends Model<IUser, {}, UserInstanceMethods> {}

interface UserInstanceMethods {
  validatePassword(password: string): boolean;
  toggleFav(productId: string): void;
}

export type UserDocument = ModelDocument<IUser>;

const UserSchema = new Schema<IUser, UserModel>({
  email: { type: String, unique: true },
  password: String,
  favProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      validate: validateRef("Product"),
    },
  ],
});

UserSchema.methods.validatePassword = function (
  this: UserDocument,
  password: string
) {
  return compareSync(password, this.password);
};

UserSchema.methods.toggleFav = function (
  this: UserDocument,
  productId: string
) {
  const productObjectId = new Types.ObjectId(productId);
  if (this.favProducts.some((id) => id.equals(productObjectId))) {
    this.favProducts = this.favProducts.filter(
      (id) => !id.equals(productObjectId)
    );
    return;
  }
  this.favProducts.push(productObjectId);
};

UserSchema.pre<UserDocument>("save", function (this, next) {
  this.password = hashSync(this.password, 10);
  next();
});

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
