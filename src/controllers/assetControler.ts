import { Response, Request } from "express";
import { Asset, AssetModel, AssetStatus } from "../models/asset";
import { AssetCreateInput } from "../db/assetDAO";
import { AssetService } from "../services/assetService";
import { Controller } from "./controllerBase";
import { BadInputError } from "../middlewares/error";
import { Pagination } from "../db/pagination";

export const assetControler: Controller<Asset> = {
  create: async (req, res) => {
    // TODO: ANOTHER endpoint who passes unitId as a param
    const input = <AssetCreateInput>req.body;
    const data = await AssetService.create(input);
    return res.status(201).json({ data });
  },
  get: async (req, res) => {
    const assetId = req.params.id;
    const data = await AssetService.read(assetId);
    return res.status(200).json({ data });
  },
  delete: async (req, res) => {
    const assetId = req.params.id;
    const data = await AssetService.delete(assetId);
    return res.status(200).json({
      message: `Unit with id ${assetId} deleted`,
      data,
    });
  },
  update: async (req, res) => {
    const assetId = req.params.id;
    const newData = <Partial<Asset>>req.body;
    const data = await AssetService.update(assetId, newData);
    return res.status(201).json({ data });
  },
  list: async (req, res) => {
    const { unitId } = req.query;
    if (!unitId) {
      throw new BadInputError("No Unit Id Provided");
    }
    const pagination = new Pagination(req);
    const dataWithPagination = await AssetService.list(
      unitId.toString(),
      pagination
    );
    return res.status(200).json(dataWithPagination);
  },
};
