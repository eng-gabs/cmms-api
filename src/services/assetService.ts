import { Asset, AssetStatus } from "../models/asset";
import { AssetCreateInput, AssetDAO } from "../db/assetDAO";
import { BadInputError } from "../middlewares/error";
import { ObjectId } from "mongoose";

interface IAssetService {
  assetDAO: typeof AssetDAO;

  create: (data: AssetCreateInput) => Promise<Asset>;
  read: (id: string) => Promise<Asset>;
  update: (id: string, data: Partial<Asset>) => Promise<Asset>;
  delete: (id: string) => Promise<Asset>;
}

class AssetServiceSingleton implements IAssetService {
  private static instance: AssetServiceSingleton;
  assetDAO;
  private constructor() {
    this.assetDAO = AssetDAO;
  }
  // Singleton Pattern
  public static getInstance(): AssetServiceSingleton {
    if (!AssetServiceSingleton.instance) {
      AssetServiceSingleton.instance = new AssetServiceSingleton();
    }
    return AssetServiceSingleton.instance;
  }
  async create(data: AssetCreateInput) {
    const { status, healthLevel } = data;
    this.isValidAssetStatus(status);
    this.isValidHealthLevel(healthLevel);
    const assetCreated = await this.assetDAO.create(data);
    return assetCreated;
  }
  async read(id: string) {
    const asset = await this.assetDAO.getAssetWithObjects(id);
    return asset;
  }
  async update(id: string, data: Partial<Asset>) {
    const { status, healthLevel } = data;
    if (status) this.isValidAssetStatus(status);
    if (healthLevel) this.isValidHealthLevel;
    const asset = await this.assetDAO.update(id, data);
    return asset;
  }

  async delete(id: string) {
    // TODO: intercept auth - owner
    const asset = await this.assetDAO.delete(id);
    return asset;
  }
  async getAssetsInfoSummary(input: {
    unitIds: (string | ObjectId)[];
    criticalHealthLevel?: number;
    // statusFilter?: AssetStatus[];
  }) {
    const { criticalHealthLevel, unitIds } = input;
    const maxHealthLevel = criticalHealthLevel
      ? Number(criticalHealthLevel)
      : 0.75;
    this.isValidHealthLevel(maxHealthLevel);
    const assetsWithLowHealthLevels =
      await AssetDAO.getAssetsWithLowHealthLevels(unitIds, maxHealthLevel);
    const statusSummary = await AssetDAO.getAssetStatusCount(unitIds);

    return {
      statusSummary,
      assetsWithLowHealthLevels,
    };
  }
  private isValidHealthLevel(healthLevel: number): void | Error {
    if (healthLevel < 0 || healthLevel > 1) {
      throw new BadInputError("Health level must be between 0 and 1");
    }
  }

  private isValidAssetStatus(status: AssetStatus): void | Error {
    if (!Object.values(AssetStatus).includes(status)) {
      throw new BadInputError(
        `Status '${status}' is invalid. Possible values are: ${Object.values(
          AssetStatus
        )}`
      );
    }
  }
}

export const AssetService = AssetServiceSingleton.getInstance();
