import { Request, Response } from "express";
import { Company, CompanyModel } from "../models/company";
import { userController } from "./userController";
import { CompanyService } from "../services/companyService";
import { sendErrorMessage } from "../utils/error";

export const companyController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, users, units } = req.body;
      const { data } = await CompanyService.create({
        name,
        users: users ?? [],
        units: units ?? [],
      });

      return res.status(201).json({ data });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { data, error } = await CompanyService.read(id);
      if (error) {
        return sendErrorMessage(error, res);
      } else {
        return res.status(200).json({ data });
      }
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

  update: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const newData: Partial<Company> = {
        name: req.body.name ?? undefined,
        users: req.body.users ?? undefined,
        units: req.body.units ?? undefined,
      };
      const { data, error } = await CompanyService.update(id, newData);
      if (error) {
        return sendErrorMessage(error, res);
      } else {
        return res.status(200).json({ data });
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { data, error } = await CompanyService.delete(id);
      if (error) {
        return sendErrorMessage(error, res);
      } else {
        return res.status(200).json({ data });
      }
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
