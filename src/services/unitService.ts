import { Unit } from "../models/unit";
import { UnitDAO } from "../db/unitDAO";
import { UnitCreateInput } from "../db/types";
interface IUnitService {
  unitDAO: typeof UnitDAO;

  create: (data: UnitCreateInput) => Promise<Unit>;
  read: (id: string) => Promise<Unit>;
  update: (id: string, data: Partial<Unit>) => Promise<Unit>;
  delete: (id: string) => Promise<Unit>;
}

class UnitServiceSingleton implements IUnitService {
  private static instance: UnitServiceSingleton;
  unitDAO;
  private constructor() {
    this.unitDAO = UnitDAO;
  }
  // Singleton Pattern
  public static getInstance(): UnitServiceSingleton {
    if (!UnitServiceSingleton.instance) {
      UnitServiceSingleton.instance = new UnitServiceSingleton();
    }
    return UnitServiceSingleton.instance;
  }
  async create(data: UnitCreateInput) {
    // TODO: intercept auth - unit unit
    const unitCreated = await this.unitDAO.create(data);
    return unitCreated;
  }
  async read(id: string) {
    // TODO: intercept auth - owner
    const unit = await this.unitDAO.getUnitWithObjects(id);
    return unit;
  }
  async update(id: string, data: Partial<Unit>) {
    // TODO: intercept auth - owner
    const unit = await this.unitDAO.update(id, data);
    return unit;
  }

  async delete(id: string) {
    // TODO: intercept auth - owner
    const unit = await this.unitDAO.delete(id);
    return unit;
  }
}

export const UnitService = UnitServiceSingleton.getInstance();
