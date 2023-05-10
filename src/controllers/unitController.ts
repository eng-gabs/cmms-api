import { Request, Response } from "express";
import { CompanyModel } from "../models/company";
import { Unit, UnitModel } from "../models/unit";
import { Controller } from "./userController";
import { UnitService } from "../services/unitService";

// TODO: Handle errors
export const unitController: Controller<Unit> = {
  create: async (req, res) => {
    try {
      const { companyId, name } = req.body;
      // const company = await CompanyModel.findById(companyId);
      // if (!company) {
      //   return res
      //     .status(400)
      //     .json({ message: `Company with id ${companyId} doesnt't exist` });
      // }
      // const unit = new UnitModel({
      //   company: companyId,
      //   name,
      // });
      // company.updateOne({
      //   $push: { units: unit.id },
      // });
      // const unitCreated = await unit.save();
      const { data } = await UnitService.create({
        // todo: error handling
        name,
        companyId,
        assets: [],
      });
      return res.status(201).json({ data });
    } catch (err) {
      return res.status(500).send();
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      const unitId = req.params.id;
      // const unit = await UnitModel.findById(unitId);
      // if (!unit) {
      //   return res
      //     .status(404)
      //     .json({ message: `Unit with id ${unitId} not found` });
      // }
      const { data, error } = await UnitService.read(unitId);
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  // TODO: remove endpoint
  list: async (req: Request, res: Response) => {
    try {
      const companyId = req.query.companyId;
      if (!companyId) {
        return res.status(400).json({
          message: "Company id is a mandatory query param to list units",
        });
      }
      const units = await UnitModel.find({ company: companyId });
      res.status(200).json({ data: units });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      // TODO: can not update if not owner
      const unitId = req.params.id;
      const name = req.body.name;
      // const updatedUnit = await UnitModel.findByIdAndUpdate(
      //   unitId,
      //   { name },
      //   { new: true }
      // );
      // TODO: throw error if tries to change company
      const { data, error } = await UnitService.update(unitId, { name });
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      // TODO: can not delete if not owner
      const unitId = req.params.id;
      const { data, error } = await UnitService.delete(unitId);
      // const deletedUnit = await UnitModel.findByIdAndDelete(unitId);
      return res
        .status(200)
        .json({ message: `Unit with id ${unitId} deleted`, data });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
};
