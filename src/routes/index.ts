import express from "express";

import { echoController, errorController } from "controller/test";

const router = express.Router();

router.get("/test/echo", echoController);
router.post("/test/error", errorController);

export default router;
