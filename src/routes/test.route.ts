import express from "express";

import { echoController, errorController } from "controller/test";

const testRouter = express.Router();

testRouter.get("/echo", echoController);
testRouter.post("/error", errorController);

export default testRouter;
