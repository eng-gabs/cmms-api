import { Response, Request } from "express";
import { AssetModel, AssetStatus } from "../models/asset";
import { UnitModel } from "../models/unit";

export const assetControler = {
  create: async (req: Request, res: Response) => {
    try {
      const unitId = req.params.id;
      const unit = await UnitModel.findById(unitId);
      if (!unit) {
        return res
          .status(404)
          .json({ message: `Unit with id ${unitId} not found.` });
      }
      const { name, description, image, model, owner, status, healthLevel } =
        req.body;

      if (!Object.values(AssetStatus).includes(status)) {
        return res
          .status(422)
          .json({ message: `Status '${status}' is invalid.` });
      }
      if (healthLevel < 0 || healthLevel > 1) {
        return res
          .status(422)
          .json({ message: `Health level must be between 0 and 1` });
      }

      const asset = new AssetModel({
        name,
        description,
        image,
        model,
        owner,
        status,
        healthLevel,
        unit: unitId,
      });

      const assetSaved = await unit
        .updateOne({
          $push: { assets: asset.id },
        })
        .then(() => asset.save());

      return res.status(201).json({ data: assetSaved });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
  get: async (req: Request, res: Response) => {
    const unitId = req.params.id;
    const assetId = req.params.assetId;
    const asset = await AssetModel.findById(assetId).populate("unit");
    if (!asset) {
      return res
        .status(404)
        .json({ message: `Asset with id ${assetId} not found.` });
    }

    if (asset.unit.id.toString() !== unitId) {
      return res.status(400).json({
        message: `Asset with id ${assetId} not found in unit with id ${unitId}.`,
      });
    }

    return res.status(200).json({ data: asset });
  },
  delete: async (req: Request, res: Response) => {
    try {
      // TODO: can not delete if not owner
      const assetId = req.params.id;
      const asset = await AssetModel.findById(assetId);
      if (!asset) {
        return res
          .status(404)
          .json({ message: `Asset with id ${assetId} not found.` });
      }
      const deletedAsset = await asset.deleteOne().then(() =>
        UnitModel.findByIdAndUpdate(asset.unit.id, {
          $pull: { assets: asset.id },
        })
      );
      return res.status(200).json({
        message: `Unit with id ${assetId} deleted`,
        data: deletedAsset,
      });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const assetId = req.params.id;

      const asset = await AssetModel.findById(assetId);
      if (!asset) {
        return res
          .status(404)
          .json({ message: `Asset with id ${assetId} not found.` });
      }
      const {
        name,
        description,
        image,
        model,
        owner,
        status,
        healthLevel,
        unitId,
      } = req.body;

      if (status && !Object.values(AssetStatus).includes(status)) {
        return res
          .status(422)
          .json({ message: `Status '${status}' is invalid.` });
      }
      if (healthLevel && (healthLevel < 0 || healthLevel > 1)) {
        return res
          .status(422)
          .json({ message: `Health level must be between 0 and 1` });
      }

      const oldUnitId = asset.unit._id.toString();
      const newUnit = unitId ? await UnitModel.findById(unitId) : undefined;
      if (unitId && !newUnit) {
        return res
          .status(404)
          .json({ message: `Unit with id ${unitId} not found.` });
      }

      const updatedAsset = await asset
        .updateOne(
          {
            name,
            description,
            image,
            model,
            owner,
            status,
            healthLevel,
            unit: unitId,
          },
          { new: true }
        )
        .then(async () => {
          const updateOldUnit = newUnit
            ? await UnitModel.findByIdAndUpdate(oldUnitId, {
                $pull: { assets: asset.id },
              })
            : undefined;
          const updateNewUnit = newUnit
            ? await newUnit.updateOne({
                $push: { assets: asset.id },
              })
            : undefined;
        });
      return res.status(201).json({ data: asset });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },
};
