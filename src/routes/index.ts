import express from "express";

import { echoController, errorController } from "controller/test";

const router = express.Router();

router.get("/test/echo", echoController);
router.get("/test/error", errorController);

export default router;
