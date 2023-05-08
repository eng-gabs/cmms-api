import { Request, Response } from "express";
import { UserModel } from "../models/user";
import { companyController } from "./companyController";

export const userController = {
  getById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = await UserModel.findById(id).populate("company");
      res.status(200).json({ data });
    } catch (err) {}
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
      res.status(200).json({ data });
    } catch (err) {}
  },
  deleteById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = await UserModel.findByIdAndDelete(id);
      res.status(200).json({ data, msg: "Data deleted" });
    } catch (err) {}
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const data = await UserModel.find();
      res.status(200).json({ data });
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
      res.status(200).json({ data });
    } catch (err) {}
  },
  updateUserCompany: async (users: string[], companyId: string) => {
    await UserModel.updateMany({ _id: { $in: users } }, { company: companyId });
  },
};
