import { controllerWrapper, ServerError, StatusCode } from "./utils";
import { RequestUser } from "auth/utils";
import { User } from "database/models";

export const favProductController = controllerWrapper<{}, {}, {}, RequestUser>(
  [],
  async (req) => {
    const { id: productId } = req.params;
    const { email } = req.user;
    const user = await User.findOne({ email });
    if (!user) throw new ServerError(StatusCode.NOT_FOUND, "user not found");
    user.toggleFav(productId);
    await user.save();
    return { statusCode: StatusCode.SUCCESS, value: {} };
  }
);
