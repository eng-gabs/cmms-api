import { Model, ObjectId, Types } from "mongoose";
import { Asset, AssetModel, AssetStatus } from "../models/asset";
import { UnitDAO } from "./unitDAO";
import { NotFoundError } from "../middlewares/error";

export type AssetCreateInput = Omit<Asset, "unit"> & { unitId: string };

type AssetStatusCount = Record<AssetStatus, number>;

type AssetsGroupedByAssetStatus = Record<AssetStatus, Asset>;
interface IAssetDAO {
  assetModel: Model<Asset>;

  create: (data: AssetCreateInput) => Promise<Asset>;
  read: (id: string) => Promise<Asset>;
  update: (id: string, data: Partial<Asset>) => Promise<Asset>;
  delete: (id: string) => Promise<Asset>;
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
    const createdAsset = new this.assetModel({
      ...otherData,
      unit: unitId,
    });
    const updateUnit = await UnitDAO.pushAsset(unitId, createdAsset.id);
    return await createdAsset.save();
  }
  async read(id: string) {
    const assetModel = await this.assetModel.findById(id);
    if (!assetModel) {
      throw new NotFoundError("asset", id);
    }
    return assetModel;
  }
  async update(id: string, newData: Partial<Asset>) {
    const asset = await this.read(id);
    if (newData.unit && asset.unit !== newData.unit) {
      const newUnit = await UnitDAO.pushAsset(newData.unit, asset.id);
      const oldUnit = await UnitDAO.pullAsset(asset.unit, asset.id);
    }
    const updatedAsset = await this.assetModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
    return updatedAsset!;
  }
  async delete(id: string) {
    const assetModel = await this.read(id);
    await UnitDAO.pullAsset(assetModel.unit, assetModel.id);
    const deletedModel = await this.assetModel.findByIdAndDelete(assetModel.id);
    return deletedModel!;
  }

  async getAssetWithObjects(id: string) {
    const asset = await this.read(id);
    return await asset.populate("unit");
  }

  async deleteAssetsInUnits(unitIds: string[]) {
    return await this.assetModel.deleteMany({
      unit: { $in: unitIds },
    });
  }

  getFilterUnitAssetsObject(input: {
    unitIds: (string | ObjectId)[];
    statuses?: AssetStatus[];
    minHealthLevel?: number;
    maxHealthLevel?: number;
  }) {
    const { unitIds, statuses, minHealthLevel, maxHealthLevel } = input;
    return {
      $and: [
        { unit: { $in: unitIds } },
        { status: { $in: statuses ?? Object.values(AssetStatus) } },
        { healthLevel: { $lte: maxHealthLevel ?? 1 } },
        { healthLevel: { $gte: minHealthLevel ?? 0 } },
      ],
    };
  }

  async filterUnitAssets(input: {
    unitIds: string[];
    statuses?: AssetStatus[];
    minHealthLevel?: number;
    maxHealthLevel?: number;
  }) {
    const filter = this.getFilterUnitAssetsObject(input);
    const assets = await this.assetModel.find(filter);
    return assets;
  }

  async getAssetStatusCount(unitIds: any[]) {
    const filter = this.getFilterUnitAssetsObject({ unitIds });
    const assetsGrouped = await this.assetModel.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          // _id: {
          //   status: "$status",
          //   unit: "$unit",
          // },
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    return this.mapAssetStatusCount(assetsGrouped);
  }

  private mapAssetStatusCount(
    assetsGrouped: { _id: AssetStatus; count: number }[]
  ) {
    const assetStatusCount = assetsGrouped
      .map(({ _id, count }) => {
        return { [_id]: count };
      })
      .reduce((prev, curr) => {
        return { ...prev, ...curr };
      });
    return assetStatusCount;
  }

  // TODO: improve to a histogram
  async getAssetsWithLowHealthLevels(
    unitIds: (string | ObjectId)[],
    maxHealthLevel: number
  ) {
    const filter = this.getFilterUnitAssetsObject({ unitIds, maxHealthLevel });
    const assets = await this.assetModel.find(filter).populate("unit");
    return assets;
  }
}

export const AssetDAO = AssetDAOSingleton.getInstance();
