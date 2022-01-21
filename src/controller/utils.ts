import { ErrorRequestHandler, Request, RequestHandler } from "express";
import { ValidationChain, validationResult } from "express-validator";

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

  constructor(errorCode: StatusCode, message?: any) {
    super(message || "");
    this.errorCode = errorCode;
  }

  static isServerError = (err: ServerError | Error): err is ServerError =>
    (err as ServerError).errorCode !== undefined;
}

interface ServerResult<T> {
  statusCode: StatusCode;
  value: T;
}

export const errorHandler: ErrorRequestHandler = (err: Error, req, res, _) => {
  res
    .status((err as ServerError).errorCode || StatusCode.INTERNAL_SERVER_ERROR)
    .json(err.message);
  // tslint:disable-next-line: no-console
  console.log(err);
};

export const notFoundMiddleware: RequestHandler = async (req, res, next) => {
  const err = new ServerError(StatusCode.NOT_FOUND, `${req.url} not found`);
  next(err);
};

export const protectController =
  (requestHandler: RequestHandler): RequestHandler =>
  async (req, res, next) => {
    const errResult = validationResult(req);
    if (!errResult.isEmpty())
      return next(
        new ServerError(
          StatusCode.BAD_REQUEST,
          JSON.stringify(errResult.array())
        )
      );
    requestHandler(req, res, next);
  };

type Controller<QueryType, BodyType, ValueType, UserType> = (
  req: Request<{ [key: string]: string }, {}, BodyType, QueryType> & {
    user: UserType;
  }
) => Promise<ServerResult<ValueType>>;

const validation = (validations: ValidationChain[]) => async (req: Request) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  return validationResult(req);
};

export const controllerWrapper = function <
  QueryType = {},
  BodyType = {},
  ValueType = {},
  UserType = never
>(
  validations: ValidationChain[],
  controller: Controller<QueryType, BodyType, ValueType, UserType>
) {
  const validateRequest = validation(validations);
  let requestHandler: RequestHandler = async (req, res, next) => {
    try {
      const errResults = await validateRequest(req);
      if (!errResults.isEmpty())
        throw new ServerError(StatusCode.BAD_REQUEST, errResults.array());
      const result = await controller(req as any);
      res.status(result.statusCode).json(result.value);
    } catch (error) {
      next(error);
    }
  };
  return Object.assign(requestHandler, { validateRequest, controller });
};
