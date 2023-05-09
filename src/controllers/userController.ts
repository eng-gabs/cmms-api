import { Request, Response } from "express";
import { User, UserModel } from "../models/user";
import { companyController } from "./companyController";
import { UserService } from "../services/userService";

interface Controller<T> {
  [key: string]: (
    req: Request,
    res: Response
  ) => Promise<Response<T, Record<string, T>> | undefined>;
}

export const userController: Controller<User> = {
  getById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { data, error } = await UserService.read(id);
      if (error) {
        return res.status(error.status).json({ message: error.message });
      } else {
        return res.status(200).json({ data });
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  updateById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);
      const newData = {
        name: req.body.name,
        email: req.body.email,
      };
      const data = await UserModel.findByIdAndUpdate(id, newData, {
        new: true,
      });
      return res.status(200).json({ data });
    } catch (err) {}
  },
  deleteById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = await UserModel.findByIdAndDelete(id);
      return res.status(200).json({ data, msg: "Data deleted" });
    } catch (err) {}
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const data = await UserModel.find();
      return res.status(200).json({ data });
    } catch (err) {}
  },
  create: async (req: Request, res: Response) => {
    try {
      const companyId: string | undefined = req.body.company;
      const data = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        company: companyId,
      });
      if (companyId) {
        companyController.addUser(companyId, data._id.toString());
      }
      return res.status(200).json({ data });
    } catch (err) {}
  },
  // updateUserCompany: async (users: string[], companyId: string) => {
  //   await UserModel.updateMany({ _id: { $in: users } }, { company: companyId });
  // },
};
