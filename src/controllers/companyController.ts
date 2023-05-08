import { Request, Response } from "express";
import { CompanyModel } from "../models/company";
import { userController } from "./userController";

export const companyController = {
  create: async (req: Request, res: Response) => {
    try {
      const data = await CompanyModel.create({
        name: req.body.name,
        users: req.body.users,
      });
      userController.updateUserCompany(req.body.users, data._id.toString());
      res.status(201).json({ data });
    } catch (err) {}
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = await CompanyModel.findById(id).populate("users");
      res.status(200).json({ data });
    } catch (err) {}
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const data = await CompanyModel.find().populate("users");
      res.status(200).json({ data });
    } catch (err) {}
  },
  addUser: async (companyId: string, userId: string) => {
    await CompanyModel.findByIdAndUpdate(companyId, {
      $push: { users: userId },
    });
  },
};
