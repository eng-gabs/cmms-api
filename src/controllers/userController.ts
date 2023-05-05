import { Request, Response } from "express";
import { UserModel } from "../models/user";

export const userController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const response = await UserModel.find();
      res.status(200).json({ response });
    } catch (err) {}
  },
  create: async (req: Request, res: Response) => {
    try {
      const response = await UserModel.create({
        name: "Gabs",
        email: "teste@teste.com",
      });
      res.status(200).json({ response });
    } catch (err) {}
  },
};
