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
  (req) => {
    const { text, repeat } = req.query;
    return ok({
      value: _.repeat(text, repeat),
      statusCode: StatusCode.SUCCESS,
    });
  }
);

export const errorController = controllerWrapper([], (req) =>
  err(new ServerError(StatusCode.TEMPORARILY_UNAVAILABLE, "Not available"))
);
