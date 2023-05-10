import { Unit } from "../models/unit";
import { UnitCreateInput, UnitDAO } from "../db/unitDAO";
import { Err, Result } from "../utils/error";

const UnitNotFound: (id: string) => Err = (id) => {
  return {
    message: `Unidade com id ${id} não encontrada`,
    status: 404,
  };
};

type UnitErrors = ReturnType<typeof UnitNotFound>;

type UnitResult = Result<Unit, UnitErrors>;

interface IUnitService {
  unitDAO: typeof UnitDAO;

  create: (data: UnitCreateInput) => Promise<UnitResult>;
  read: (id: string) => Promise<UnitResult>;
  update: (id: string, data: Partial<Unit>) => Promise<UnitResult>;
  delete: (id: string) => Promise<UnitResult>;
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
    return { data: unitCreated };
  }
  async read(id: string) {
    // TODO: intercept auth - owner
    const unit = await this.unitDAO.getUnitWithObjects(id);
    if (!unit) return { error: UnitNotFound(id) };
    return { data: unit };
  }
  async update(id: string, data: Partial<Unit>) {
    // TODO: intercept auth - owner
    const unit = await this.unitDAO.update(id, data);
    if (!unit) return { error: UnitNotFound(id) };
    return { data: unit };
  }

  async delete(id: string) {
    // TODO: intercept auth - owner
    const unit = await this.unitDAO.delete(id);
    if (!unit) return { error: UnitNotFound(id) };
    return { data: unit };
  }
}

export const UnitService = UnitServiceSingleton.getInstance();
