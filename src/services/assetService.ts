import { Asset, AssetStatus } from "../models/asset";
import { AssetCreateInput, AssetDAO } from "../db/assetDAO";
import { Err, Result } from "../utils/error";

const AssetNotFound: (id: string) => Err = (id) => {
  return {
    message: `Asset com id ${id} não encontrada`,
    status: 404,
  };
};

type AssetErrors = ReturnType<typeof AssetNotFound>;

type AssetResult = Result<Asset, AssetErrors>;

interface IAssetService {
  assetDAO: typeof AssetDAO;

  create: (data: AssetCreateInput) => Promise<AssetResult>;
  read: (id: string) => Promise<AssetResult>;
  update: (id: string, data: Partial<Asset>) => Promise<AssetResult>;
  delete: (id: string) => Promise<AssetResult>;
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
    // TODO: intercept auth - asset asset
    const { status, healthLevel } = data;
    // if (!Object.values(AssetStatus).includes(status)) {
    //   // TODO: throw business error
    //   // return res
    //   //   .status(422)
    //   //   .json({ message: `Status '${status}' is invalid.` });
    // }
    this.isValidAssetStatus(status);
    this.isValidHealthLevel(healthLevel);
    // if (healthLevel < 0 || healthLevel > 1) {
    // TODO: throw business error
    // return res
    //   .status(422)
    //   .json({ message: `Health level must be between 0 and 1` });
    // }

    const assetCreated = await this.assetDAO.create(data);
    return { data: assetCreated };
  }
  async read(id: string) {
    // TODO: intercept auth - owner
    const asset = await this.assetDAO.getAssetWithObjects(id);
    if (!asset) return { error: AssetNotFound(id) };
    return { data: asset };
  }
  async update(id: string, data: Partial<Asset>) {
    // TODO: intercept auth - owner
    const { status, healthLevel } = data;
    if (status) this.isValidAssetStatus(status);
    if (healthLevel) this.isValidHealthLevel;
    const asset = await this.assetDAO.update(id, data);
    if (!asset) return { error: AssetNotFound(id) };
    return { data: asset };
  }

  async delete(id: string) {
    // TODO: intercept auth - owner
    const asset = await this.assetDAO.delete(id);
    if (!asset) return { error: AssetNotFound(id) };
    return { data: asset };
  }
  private isValidHealthLevel(healthLevel: number): void | Error {
    if (healthLevel < 0 || healthLevel > 1) {
      return new Error("Health level must be between 0 and 1");
    }
  }

  private isValidAssetStatus(status: AssetStatus): void | Error {
    if (!Object.values(AssetStatus).includes(status)) {
      return new Error(`Status '${status}' is invalid.`);
    }
  }
}

export const AssetService = AssetServiceSingleton.getInstance();
