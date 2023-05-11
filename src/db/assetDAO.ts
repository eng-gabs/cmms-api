import { Model, ObjectId } from "mongoose";
import { Asset, AssetModel } from "../models/asset";
import { UnitDAO } from "./unitDAO";

export type AssetCreateInput = Omit<Asset, "unit"> & { unitId: string };

interface IAssetDAO {
  assetModel: Model<Asset>;

  create: (data: AssetCreateInput) => Promise<Asset | null>;
  read: (id: string) => Promise<Asset | null>;
  update: (id: string, data: Partial<Asset>) => Promise<Asset | null>;
  delete: (id: string) => Promise<Asset | null>;
}

export class AssetDAOSingleton implements IAssetDAO {
  private static instance: AssetDAOSingleton;
  assetModel;
  constructor() {
    this.assetModel = AssetModel;
  }
  public static getInstance(): AssetDAOSingleton {
    if (!AssetDAOSingleton.instance) {
      AssetDAOSingleton.instance = new AssetDAOSingleton();
    }
    return AssetDAOSingleton.instance;
  }
  async create(data: AssetCreateInput) {
    const { unitId, ...otherData } = data;
    const unit = await UnitDAO.read(unitId);
    //if (!company) return null; // TODO: throw error not found
    const createdAsset = new this.assetModel({
      ...otherData,
      unit: unitId,
    });
    const updateUnit = await UnitDAO.pushAsset(unitId, createdAsset.id);
    // TODO: error handling
    return await createdAsset.save();
  }
  async read(id: string) {
    const assetModel = await this.assetModel.findById(id);
    if (!assetModel) {
      return null;
    }
    return assetModel;
  }
  async update(id: string, newData: Partial<Asset>) {
    const asset = await this.read(id);
    if (!asset) return null;
    if (newData.unit && asset.unit !== newData.unit) {
      const newUnit = await UnitDAO.pushAsset(newData.unit, asset.id);
      const oldUnit = await UnitDAO.pullAsset(asset.unit, asset.id);
    }
    return await this.assetModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
  }
  async delete(id: string) {
    const assetModel = await this.read(id);
    if (!assetModel) return null;
    await UnitDAO.pullAsset(assetModel.unit, assetModel.id);
    const deletedModel = await this.assetModel.findByIdAndDelete(assetModel.id);
    return deletedModel;
  }

  async getAssetWithObjects(id: string) {
    const asset = await this.read(id);
    return asset ? asset.populate("unit") : null;
  }

  async deleteAssetsInUnits(unitIds: (string | ObjectId)[]) {
    return await this.assetModel.deleteMany({ unit: { $in: unitIds } });
  }

  // async updateAssetsUnit(assetIds: string[], unitId: string) {
  //   const batchUpdate = await this.assetModel.updateMany(
  //     {
  //       _id: { $in: assetIds },
  //     },
  //     { unit: unitId }
  //   );
  // }

  // private async changeAssetUnit(asset: Document<Asset, {}, Asset>, newUnitId: string) {
  //   asset.un
  // }
}

export const AssetDAO = AssetDAOSingleton.getInstance();
