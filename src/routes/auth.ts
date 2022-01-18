import express from "express";
import { body, check } from "express-validator";
import passport from "passport";

import { createToken } from "auth/utils";
import { protectController, ServerError, StatusCode } from "controller/utils";

const authRouter = express.Router();
authRouter.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  protectController(async (req, res, next) =>
    passport.authenticate("login", async (err, user) => {
      if (err || !user)
        return next(
          new ServerError(
            StatusCode.UNAUTHORIZED,
            err?.message || "Unauthorized"
          )
        );
      req.login(user, { session: false }, (err) => {
        if (err) return next(err);
        res.status(StatusCode.SUCCESS).json({
          access_token: createToken(user),
        });
      });
    })(req, res, next)
  )
);

export default authRouter;
