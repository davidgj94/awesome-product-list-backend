import express from "express";

import testRouter from "./test.route";
import authRouter from "./auth";

const router = express.Router();

router.use("/test", testRouter);
router.use("/auth", authRouter);

export default router;
