import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";

function assertIsApiError(error: any): error is ApiError {
  return !!error.statusCode;
}

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
