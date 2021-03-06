import { query } from "express-validator";
import * as _ from "lodash";

import { ok, err } from "core/result";
import { controllerWrapper, ServerError, StatusCode } from "./utils";

interface IEchoQuery {
  text: string;
  repeat: number;
}

export const echoController = controllerWrapper<IEchoQuery, {}, string>(
  [
    query("text").isString().trim('"'),
    query("repeat").default(1).isNumeric().toInt(),
  ],
  async (req) => {
    const { text, repeat } = req.query;
    return {
      value: _.repeat(text, repeat),
      statusCode: StatusCode.SUCCESS,
    };
  }
);

export const errorController = controllerWrapper([], async (req) => {
  throw new ServerError(StatusCode.UNAUTHORIZED, "Unauthorized");
});
