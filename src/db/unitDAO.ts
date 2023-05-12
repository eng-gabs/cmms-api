import { Model, ObjectId } from "mongoose";
import { Unit, UnitModel } from "../models/unit";
import { CompanyDAO } from "./companyDAO";
import { AssetDAO } from "./assetDAO";
import { BadInputError, NotFoundError } from "../middlewares/error";
import { UnitCreateInput } from "./types";
import { Pagination } from "./pagination";

interface DBPagination {
  offset: number;
  limit: number;
}

interface Paginated<T> {
  data: T[];
  previousUrl: string | null;
  nextUrl: string | null;
}
interface IUnitDAO {
  unitModel: Model<Unit>;

  create: (data: UnitCreateInput) => Promise<Unit>;
  read: (id: string) => Promise<Unit>;
  list: (companyId: string, pagination: Pagination) => Promise<Paginated<Unit>>;
  update: (id: string, data: Partial<Unit>) => Promise<Unit>;
  delete: (id: string) => Promise<Unit>;
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
    const createdUnit = new this.unitModel({
      ...otherData,
      company: companyId,
    });
    const pushedUnit = await CompanyDAO.pushUnit(companyId, createdUnit.id);
    if (data.assets && data.assets.length > 0) {
      throw new BadInputError("Can not link Assets before creating Unit.");
    }
    return await createdUnit.save();
  }

  async list(companyId: string, pagination: Pagination) {
    const company = await CompanyDAO.read(companyId); // Checks if company exists
    const model = this.unitModel;
    const list = await pagination.findItemsWithPagination(model, {
      company: companyId,
    });
    return list;
  }
  async read(id: string | ObjectId) {
    const unitModel = await this.unitModel.findById(id);
    if (!unitModel) {
      throw new NotFoundError("unit", id.toString());
    }
    return unitModel;
  }
  async update(id: string, newData: Partial<Unit>) {
    const unitModel = await this.read(id);
    if (!unitModel) throw new NotFoundError("unit", id);
    if (newData.company && newData.company != unitModel.company) {
      const newCompanyUpdate = await CompanyDAO.pushUnit(newData.company, id);
      const oldCompanyUpdate = await CompanyDAO.pullUnit(unitModel.company, id);
    }
    if (newData.assets) {
      // ToDo: this rule and error should be in controller -> improve typing
      throw new BadInputError(
        "Can not change Assets through this endpoint. Use PATCH /api/asset/:id to update asset unit instead."
      );
    }
    const unitUpdated = await this.unitModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
    return unitUpdated!;
  }
  async delete(id: string) {
    const unitModel = await this.read(id);
    // Remove company
    await CompanyDAO.pullUnit(unitModel.company, id);
    // Delete cascade assets
    await AssetDAO.deleteAssetsInUnits([id]);
    const deletedModel = await this.unitModel.findByIdAndDelete(id);
    return deletedModel!;
  }

  async getCompanyUnits(companyId: string) {
    const units = await this.unitModel.find({ company: companyId });
    return units;
  }

  async getUnitWithObjects(id: string) {
    const unit = await this.read(id);
    return unit?.populate("company assets") ?? null;
  }

  async pushAsset(id: string | ObjectId, assetId: ObjectId) {
    const updatedUnit = await this.unitModel.findByIdAndUpdate(id, {
      $push: { assets: assetId },
    });
    if (!updatedUnit) throw new NotFoundError("unit", id.toString());
    return updatedUnit;
  }

  async pullAsset(id: string | ObjectId, assetId: ObjectId) {
    const updatedUnit = await this.unitModel.findByIdAndUpdate(id, {
      $pull: { assets: assetId },
    });
    if (!updatedUnit) throw new NotFoundError("unit", id.toString());
    return updatedUnit;
  }

  async deleteCompanyUnits(companyId: string | ObjectId) {
    const unitsToDelete = await this.unitModel.find({ company: companyId });
    const unitIds = unitsToDelete.map((unit) => unit.id);
    await AssetDAO.deleteAssetsInUnits(unitIds);
    return await this.unitModel.deleteMany({ company: companyId });
  }
}

export const UnitDAO = UnitDAOSingleton.getInstance();
