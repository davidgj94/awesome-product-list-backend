import express from "express";
import passport from "passport";

import { favProductController } from "controller/product";

const productsRouter = express.Router();
productsRouter.post(
  "/:id/fav",
  passport.authenticate("jwt", { session: false }),
  favProductController
);

export default productsRouter;
