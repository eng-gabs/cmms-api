import { Request, Response } from "express";

export class ApiError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends ApiError {
  constructor(entityName: string, entityId: string) {
    const message = `Entity ${entityName} with id ${entityId} not found`;
    super(message, 404);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class BadInputError extends ApiError {
  constructor(message: string) {
    super(message, 422);
  }
}

export interface Err {
  message: string;
  status: number; // http status code
}

export interface Result<DataType extends Object | null, E extends Err> {
  data?: DataType;
  error?: E;
}

export function sendErrorMessage(error: Err, res: Response) {
  return res.status(error.status).json({ message: error.message });
}

export async function processRequestAndResponseWrapper<
  T extends Object | null,
  E extends Err
>(
  fn: (req: Request, res: Response) => Promise<Result<T, E>>,
  req: Request,
  res: Response
) {
  try {
    const { data, error } = await fn(req, res);
    if (error) {
      return sendErrorMessage(error, res);
    } else {
      return res.status(200).json({ data });
    }
  } catch (err) {
    // Unknown Error returns an internal server error
    console.error(err);
    return res.status(500).json({
      message: "Erro desconhecido. Entre em contato com o administrador",
    });
  }
}
