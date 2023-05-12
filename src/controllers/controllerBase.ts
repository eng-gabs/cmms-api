import { Request, Response } from "express";
export interface Controller<T> {
  [key: string]: (
    req: Request,
    res: Response
  ) => Promise<Response<T, Record<string, T>> | undefined>;
}
