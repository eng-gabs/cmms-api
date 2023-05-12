import { Request, Response } from "express";
import { Company, CompanyModel } from "../models/company";
import { CompanyService } from "../services/companyService";
import { AssetDAO } from "../db/assetDAO";
import { UnitDAO } from "../db/unitDAO";

export const companyController = {
  create: async (req: Request, res: Response) => {
    const { name, users, units } = req.body;
    const data = await CompanyService.create({
      name,
      users: users ?? [],
      units: units ?? [],
    });
    return res.status(201).json({ data });
  },

  getById: async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await CompanyService.read(id);
    return res.status(200).json({ data });
  },
  getAll: async (req: Request, res: Response) => {
    const data = await CompanyModel.find().populate("users");
    return res.status(200).json({ data });
  },

  update: async (req: Request, res: Response) => {
    const id = req.params.id;
    const newData: Partial<Company> = {
      name: req.body.name ?? undefined,
      users: req.body.users ?? undefined,
      units: req.body.units ?? undefined,
    };
    const data = await CompanyService.update(id, newData);
    return res.status(200).json({ data });
  },
  delete: async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await CompanyService.delete(id);
    return res.status(200).json({ data });
  },
  info: async (req: Request, res: Response) => {
    const unit = await UnitDAO.read("645d63cc4d3b287a4fe2dba7");
    const teste = await AssetDAO.getAssetStatusCount([unit!._id!]);
    const teste2 = await AssetDAO.filterUnitAssets({
      unitIds: [unit!._id!],
      // [AssetStatus.RUNNING]
    });
    const teste3 = await AssetDAO.getAssetsHealthLevelCount([unit!._id!], 1);

    const input = {
      companyId: req.params.id,
      unitIds: req.query.units,
      status: req.query.status,
      criticalHealth: req.query.criticalHealth,
    };

    console.log("input", input);

    const { data } = await CompanyService.getCompanyUnitsAssetsSummary(
      input.companyId
    );

    res.status(200).json({ data });
  },
};
