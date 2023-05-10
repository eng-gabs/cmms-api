import { Request, Response } from "express";

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
