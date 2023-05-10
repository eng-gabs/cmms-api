import { Request, Response } from "express";
import { CompanyModel } from "../models/company";
import { userController } from "./userController";
import { CompanyService } from "../services/companyService";

export const companyController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, users } = req.body;
      const company = new CompanyModel({
        name,
        users,
      });
      const { data } = await CompanyService.create({
        name,
        users: [],
        units: [],
      });
      // const companyCreated = await userController
      //   .updateUserCompany(users, company.id)
      //   .then(() => company.save());
      return res.status(201).json({ data });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = await CompanyModel.findById(id).populate("users");
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const data = await CompanyModel.find().populate("users");
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  addUser: async (companyId: string, userId: string) => {
    await CompanyModel.findByIdAndUpdate(companyId, {
      $push: { users: userId },
    });
  },
};
