import { Response, Request } from "express";
import { Asset, AssetModel, AssetStatus } from "../models/asset";
import { UnitModel } from "../models/unit";
import { AssetCreateInput } from "../db/assetDAO";
import { AssetService } from "../services/assetService";
import { Controller } from "./userController";

export const assetControler: Controller<Asset> = {
  create: async (req: Request, res: Response) => {
    try {
      // TODO: ANOTHER endpoint who passes unitId as a param
      // const unitId = req.params.id;
      // const unit = await UnitModel.findById(unitId);
      // if (!unit) {
      //   return res
      //     .status(404)
      //     .json({ message: `Unit with id ${unitId} not found.` });
      // }
      // const { name, description, image, model, owner, status, healthLevel } =
      //   req.body;

      const input = <AssetCreateInput>req.body;

      // if (!Object.values(AssetStatus).includes(input.status)) {
      //   return res
      //     .status(422)
      //     .json({ message: `Status '${status}' is invalid.` });
      // }
      // if (healthLevel < 0 || healthLevel > 1) {
      //   return res
      //     .status(422)
      //     .json({ message: `Health level must be between 0 and 1` });
      // }

      // const asset = new AssetModel({
      //   name,
      //   description,
      //   image,
      //   model,
      //   owner,
      //   status,
      //   healthLevel,
      //   unit: unitId,
      // });

      // TODO: error handling
      const { data } = await AssetService.create(input);

      // const assetSaved = await unit
      //   .updateOne({
      //     $push: { assets: asset.id },
      //   })
      //   .then(() => asset.save());

      return res.status(201).json({ data });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  get: async (req: Request, res: Response) => {
    // const unitId = req.params.id;
    const assetId = req.params.id;

    // const asset = await AssetModel.findById(assetId).populate("unit");
    // if (!asset) {
    //   return res
    //     .status(404)
    //     .json({ message: `Asset with id ${assetId} not found.` });
    // }

    // Bad input rule: mismatch unitId and assetId
    // if (asset.unit._id.toString() !== unitId) {
    //   return res.status(400).json({
    //     message: `Asset with id ${assetId} not found in unit with id ${unitId}.`,
    //   });
    // }

    try {
      // todo: error handling
      const { data } = await AssetService.read(assetId);
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      // TODO: can not delete if not owner
      const assetId = req.params.id;
      // const asset = await AssetModel.findById(assetId);
      // if (!asset) {
      //   return res
      //     .status(404)
      //     .json({ message: `Asset with id ${assetId} not found.` });
      // }
      // TODO: remove from unit
      // const deletedAsset = await asset.deleteOne().then(() =>
      //   UnitModel.findByIdAndUpdate(asset.unit, {
      //     $pull: { assets: asset.id },
      //   })
      // );
      // TODO: error handling
      const { data } = await AssetService.delete(assetId);
      return res.status(200).json({
        message: `Unit with id ${assetId} deleted`,
        data,
      });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const assetId = req.params.id;

      // const asset = await AssetModel.findById(assetId);
      // if (!asset) {
      //   return res
      //     .status(404)
      //     .json({ message: `Asset with id ${assetId} not found.` });
      // }
      // const {
      //   name,
      //   description,
      //   image,
      //   model,
      //   owner,
      //   status,
      //   healthLevel,
      //   unitId,
      // } = req.body;

      // if (status && !Object.values(AssetStatus).includes(status)) {
      //   return res
      //     .status(422)
      //     .json({ message: `Status '${status}' is invalid.` });
      // }
      // if (healthLevel && (healthLevel < 0 || healthLevel > 1)) {
      //   return res
      //     .status(422)
      //     .json({ message: `Health level must be between 0 and 1` });
      // }

      const newData = <Partial<Asset>>req.body;
      // todo: error handling
      const { data } = await AssetService.update(assetId, newData);

      // TODO: UPDATE AssetDAO to work change unit correctly in case user wants it

      // const oldUnitId = asset.unit;
      // const newUnit = unitId ? await UnitModel.findById(unitId) : undefined;
      // if (unitId && !newUnit) {
      //   return res
      //     .status(404)
      //     .json({ message: `Unit with id ${unitId} not found.` });
      // }

      // const updatedAsset = await asset
      //   .updateOne(
      //     {
      //       name,
      //       description,
      //       image,
      //       model,
      //       owner,
      //       status,
      //       healthLevel,
      //       unit: unitId,
      //     },
      //     { new: true }
      //   )
      //   .then(async () => {
      //     const updateOldUnit = newUnit
      //       ? await UnitModel.findByIdAndUpdate(oldUnitId, {
      //           $pull: { assets: asset.id },
      //         })
      //       : undefined;
      //     const updateNewUnit = newUnit
      //       ? await newUnit.updateOne({
      //           $push: { assets: asset.id },
      //         })
      //       : undefined;
      //   });

      return res.status(201).json({ data });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
};
