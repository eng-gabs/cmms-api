import { NextFunction, Request, Response } from "express";
export const errorMiddleware = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, statusCode } = assertIsApiError(error)
    ? { message: error.message, statusCode: error.statusCode }
    : { message: "Internal Server Error", statusCode: 500 };
  console.error(error);
  return res.status(statusCode).json({ message });
};

function assertIsApiError(error: any): error is ApiError {
  return !!error.statusCode;
}

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
