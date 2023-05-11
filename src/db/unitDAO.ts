import { Model, ObjectId } from "mongoose";
import { Unit, UnitModel } from "../models/unit";
import { CompanyDAO } from "./companyDAO";
import { AssetDAO } from "./assetDAO";

type KeysWithoutObjectIdArray<T> = {
  [K in keyof T]: T[K] extends ObjectId[] ? never : K;
}[keyof T];

type ObjectIdToString<T> = {
  [K in keyof T]: T[K] extends ObjectId ? string : T[K];
};

type CreateInput<T> = ObjectIdToString<Pick<T, KeysWithoutObjectIdArray<T>>>;

export type UnitCreateInput = Omit<Unit, "company"> & { companyId: string };

interface IUnitDAO {
  unitModel: Model<Unit>;

  create: (data: UnitCreateInput) => Promise<Unit | null>;
  read: (id: string) => Promise<Unit | null>;
  update: (id: string, data: Partial<Unit>) => Promise<Unit | null>;
  delete: (id: string) => Promise<Unit | null>;
}

export class UnitDAOSingleton implements IUnitDAO {
  private static instance: UnitDAOSingleton;
  unitModel;
  constructor() {
    this.unitModel = UnitModel;
  }
  public static getInstance(): UnitDAOSingleton {
    if (!UnitDAOSingleton.instance) {
      UnitDAOSingleton.instance = new UnitDAOSingleton();
    }
    return UnitDAOSingleton.instance;
  }
  async create(data: UnitCreateInput) {
    const { companyId, ...otherData } = data;
    const company = await CompanyDAO.read(companyId);
    //if (!company) return null; // TODO: throw error not found
    const createdUnit = new this.unitModel({
      ...otherData,
      company: companyId,
    });
    // TODO: add unit to company
    const pushedUnit = await CompanyDAO.pushUnit(companyId, createdUnit.id);
    // if (!pushedUnit) return null; // TODO: throw could not push

    // CAN NOT LINK ASSETS WHEN CREATING
    return await createdUnit.save();
  }
  async read(id: string | ObjectId) {
    const unitModel = await this.unitModel.findById(id);
    if (!unitModel) {
      return null;
    }
    return unitModel;
  }
  async update(id: string, newData: Partial<Unit>) {
    const unitModel = await this.read(id);
    if (!unitModel) return null;
    // Todo: change company
    if (newData.company && newData.company != unitModel.company) {
      const newCompanyUpdate = await CompanyDAO.pushUnit(newData.company, id);
      const oldCompanyUpdate = await CompanyDAO.pullUnit(unitModel.company, id);
    }
    if (newData.assets) {
      // TODO: throw error Change assets is not possible
    }
    return await this.unitModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
  }
  async delete(id: string) {
    const unitModel = await this.read(id);
    if (!unitModel) return null;
    // Remove company
    await CompanyDAO.pullUnit(unitModel.company, id);
    // Delete cascade assets
    await AssetDAO.deleteAssetsInUnits([id]);
    const deletedModel = await this.unitModel.findByIdAndDelete(id);
    return deletedModel;
  }

  async getUnitWithObjects(id: string) {
    const unit = await this.read(id);
    return unit?.populate("company assets") ?? null;
  }

  async pushAsset(id: string | ObjectId, assetId: ObjectId) {
    const unit = await this.read(id);
    if (!unit) return null;
    return await this.unitModel.findByIdAndUpdate(id, {
      $push: { assets: assetId },
    });
  }

  async pullAsset(id: string | ObjectId, assetId: ObjectId) {
    const unit = await this.read(id);
    if (!unit) return null;
    return await this.unitModel.findByIdAndUpdate(id, {
      $pull: { assets: assetId },
    });
  }

  async deleteCompanyUnits(companyId: string | ObjectId) {
    const unitsToDelete = await this.unitModel.find({ company: companyId });
    const unitIds = unitsToDelete.map((unit) => unit.id);
    await AssetDAO.deleteAssetsInUnits(unitIds);
    return await this.unitModel.deleteMany({ company: companyId });
  }
}

export const UnitDAO = UnitDAOSingleton.getInstance();
