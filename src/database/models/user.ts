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
}

export type UserDocument = ModelDocument<IUser>;

const UserSchema = new Schema<IUser, UserModel>({
  email: String,
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

UserSchema.pre<UserDocument>("save", function (this, next) {
  this.password = hashSync(this.password, 10);
  next();
});

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
