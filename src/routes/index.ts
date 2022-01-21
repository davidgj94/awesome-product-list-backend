import express from "express";

import testRouter from "./test.route";
import authRouter from "./auth";
import productsRouter from "./product";

const router = express.Router();

router.use("/test", testRouter);
router.use("/auth", authRouter);
router.use("/product", productsRouter);

export default router;
