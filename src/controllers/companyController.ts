import { Company, CompanyModel } from "../models/company";
import { CompanyService } from "../services/companyService";
import { AssetDAO } from "../db/assetDAO";
import { UnitDAO } from "../db/unitDAO";
import { Controller } from "./controllerBase";
import { UnitModel } from "../models/unit";
import { AssetModel } from "../models/asset";

export const companyController: Controller<Company> = {
  create: async (req, res) => {
    const { name, users, units } = req.body;
    const data = await CompanyService.create({
      name,
      users: users ?? [],
      units: units ?? [],
    });
    return res.status(201).json({ data });
  },

  getById: async (req, res) => {
    const id = req.params.id;
    const data = await CompanyService.read(id);
    return res.status(200).json({ data });
  },
  update: async (req, res) => {
    const id = req.params.id;
    const newData: Partial<Company> = {
      name: req.body.name ?? undefined,
      users: req.body.users ?? undefined,
      units: req.body.units ?? undefined,
    };
    const data = await CompanyService.update(id, newData);
    return res.status(200).json({ data });
  },
  delete: async (req, res) => {
    const id = req.params.id;
    const data = await CompanyService.delete(id);
    return res.status(200).json({ data });
  },
  info: async (req, res) => {
    const input = {
      companyId: req.params.id,
      unitIds: req.query.units as string[],
      criticalHealth: req.query.criticalHealth,
    };
    const data = await CompanyService.getCompanyUnitsAssetsSummary(input);

    return res.status(200).json({ data });
  },
};
