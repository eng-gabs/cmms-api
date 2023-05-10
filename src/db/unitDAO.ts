import { Model } from "mongoose";
import { Unit, UnitModel } from "../models/unit";
import { UserDAO } from "./userDAO";
import { User } from "../models/user";
import { CompanyDAO } from "./companyDAO";

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
    return await createdUnit.save();
  }
  async read(id: string) {
    const unitModel = await this.unitModel.findById(id);
    if (!unitModel) {
      return null;
    }
    return unitModel;
  }
  async update(id: string, newData: Partial<Unit>) {
    const unitModel = await this.read(id);
    if (!unitModel) return null;
    return await this.unitModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
  }
  async delete(id: string) {
    const unitModel = await this.read(id);
    if (!unitModel) return null;
    const deletedModel = await unitModel.deleteOne().then(() => unitModel);
    return deletedModel;
  }

  async getUnitWithObjects(id: string) {
    const unit = await this.read(id);
    return unit?.populate("company assets") ?? null;
  }
}

export const UnitDAO = UnitDAOSingleton.getInstance();
