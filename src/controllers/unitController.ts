import { Unit } from "../models/unit";
import { Controller } from "./controllerBase";
import { UnitService } from "../services/unitService";
import { Pagination } from "../db/pagination";
import { BadInputError } from "../middlewares/error";

export const unitController: Controller<Unit> = {
  create: async (req, res) => {
    const { companyId, name } = req.body;
    const data = await UnitService.create({
      name,
      companyId,
      assets: [],
    });
    return res.status(201).json({ data });
  },
  get: async (req, res) => {
    const unitId = req.params.id;
    const data = await UnitService.read(unitId);
    return res.status(200).json({ data });
  },
  list: async (req, res) => {
    const { companyId } = req.query;
    if (!companyId) {
      throw new BadInputError("No Company Id Provided");
    }
    const pagination = new Pagination(req);
    const dataWithPagination = await UnitService.list(
      companyId.toString(),
      pagination
    );
    return res.status(200).json(dataWithPagination);
  },
  update: async (req, res) => {
    const unitId = req.params.id;
    const name = req.body.name;
    const data = await UnitService.update(unitId, { name });
    return res.status(200).json({ data });
  },
  delete: async (req, res) => {
    const unitId = req.params.id;
    const data = await UnitService.delete(unitId);
    return res
      .status(200)
      .json({ message: `Unit with id ${unitId} deleted`, data });
  },
};
