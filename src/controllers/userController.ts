import { Request, Response } from "express";
import { User } from "../models/user";
import { UserService } from "../services/userService";
import { Controller } from "./controllerBase";

export const userController: Controller<User> = {
  getById: async (req, res) => {
    const id = req.params.id;
    const user = await UserService.read(id);
    return res.status(200).json({ data: user });
  },
  updateById: async (req: Request, res: Response) => {
    const id = req.params.id;
    const newData: Partial<User> = req.body;
    const user = await UserService.update(id, newData);
    return res.status(200).json({ data: user });
  },
  deleteById: async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await UserService.delete(id);
    return res.status(200).json({ data, msg: "Data deleted" });
  },
  create: async (req: Request, res: Response) => {
    const input: User = {
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
    };
    const data = await UserService.create(input);
    return res.status(200).json({ data });
  },
};
