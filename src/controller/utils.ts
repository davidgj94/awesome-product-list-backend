import { ErrorRequestHandler, Request, RequestHandler } from "express";
import { ValidationChain, validationResult } from "express-validator";

import { Result } from "core/result";

export const enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDEN = 403,
  NOT_FOUND = 404,
  RESOURCE_ALREADY_EXIST = 409,
  INTERNAL_SERVER_ERROR = 500,
  TEMPORARILY_UNAVAILABLE = 503,
}

export class ServerError extends Error {
  public errorCode: StatusCode;

  constructor(errorCode: StatusCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

interface ServerResult<T> {
  statusCode: StatusCode;
  value: T;
}

export const errorHandler: ErrorRequestHandler = (err: Error, req, res, _) => {
  res
    .status((err as ServerError).errorCode || StatusCode.INTERNAL_SERVER_ERROR)
    .send({ error: err.message });
  // tslint:disable-next-line: no-console
  console.log(err);
};

export const notFoundMiddleware: RequestHandler = async (req, res, next) => {
  const err = new ServerError(StatusCode.NOT_FOUND, `${req.url} not found`);
  next(err);
};

type Controller<QueryType, BodyType, ValueType> = (
  req: Request<{}, {}, BodyType, QueryType>
) => Result<ServerResult<ValueType>, ServerError>;

const validation = (validations: ValidationChain[]) => async (req: Request) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  return validationResult(req);
};

export const controllerWrapper = function <
  QueryType = {},
  BodyType = {},
  ValueType = {}
>(
  validations: ValidationChain[],
  controller: Controller<QueryType, BodyType, ValueType>
) {
  const validateRequest = validation(validations);
  let requestHandler: RequestHandler = async (req, res, next) => {
    const errors = await validateRequest(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const result = await controller(
      req as unknown as Request<{}, {}, BodyType, QueryType>
    );
    if (result.isOk()) {
      res.status(result.value.statusCode).json(result.value.value);
    } else {
      next(result.error);
    }
  };
  return Object.assign(requestHandler, { validateRequest, controller });
};
