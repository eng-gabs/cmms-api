import { Response } from "express";

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
