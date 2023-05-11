import { Model, ObjectId } from "mongoose";
import { Company, CompanyModel } from "../models/company";
import { User } from "../models/user";
import { UnitDAO } from "./unitDAO";

interface ICompanyDAO {
  companyModel: Model<Company>;

  create: (data: Company) => Promise<Company | null>;
  read: (id: string) => Promise<Company | null>;
  update: (id: string, data: Partial<Company>) => Promise<Company | null>;
  delete: (id: string) => Promise<Company | null>;
}

export class CompanyDAOSingleton implements ICompanyDAO {
  private static instance: CompanyDAOSingleton;
  companyModel;
  constructor() {
    this.companyModel = CompanyModel;
  }
  public static getInstance(): CompanyDAOSingleton {
    if (!CompanyDAOSingleton.instance) {
      CompanyDAOSingleton.instance = new CompanyDAOSingleton();
    }
    return CompanyDAOSingleton.instance;
  }
  async create(data: Company) {
    const createdCompany = new this.companyModel(data);
    return await createdCompany.save();
  }
  async read(id: string | ObjectId) {
    const companyModel = await this.companyModel.findById(id);
    if (!companyModel) {
      return null;
    }
    return companyModel;
  }

  async getCompanyWithObjects(id: string) {
    const companyModel = await this.companyModel
      .findById(id)
      .populate("users units");
    if (!companyModel) {
      return null;
    }
    return companyModel;
  }

  // Not possible to update users and units using this method: use push and pull methods instead
  /* 
  Dois casos de uso: 
    1. usuário quer atualizar toda a company com uma lista de usuarios (nao implementado)
    2. usuario quer adicionar ou remover um usuario dessa lista

    a nivel de dao é necessario implementar os dois casos por conta de performance?
  */
  async update(id: string, newData: Partial<Company>) {
    const companyModel = await this.read(id);
    // const updateCompany TODO: update company via CompanyDAO
    if (!companyModel) return null;
    if (newData.units) {
      // throw error
      return null;
    }
    if (newData.users) {
      // throw error
      return null;
    }
    return await this.companyModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
  }
  async delete(id: string) {
    const companyModel = await this.read(id);
    if (!companyModel) return null;
    // Delete Cascade Units
    await UnitDAO.deleteCompanyUnits(id);
    return await this.companyModel.findByIdAndDelete(id);
  }
  async pushUser(id: string | ObjectId, userId: string | ObjectId) {
    const companyModel = await this.read(id);
    if (!companyModel) return null;
    const updatedCompany = await companyModel.updateOne(
      {
        $push: { users: userId },
      },
      { new: true }
    );
    return updatedCompany;
  }

  async pullUser(id: string | ObjectId, userId: string) {
    const companyModel = await this.read(id);
    if (!companyModel) return null;
    const updatedCompany = await companyModel.updateOne(
      {
        $pull: { users: userId },
      },
      { new: true }
    );
    return updatedCompany;
  }

  async pushUnit(id: string | ObjectId, unitId: string | ObjectId) {
    const company = await this.read(id);
    if (!company) return null;
    return await this.companyModel.findByIdAndUpdate(
      id,
      {
        $push: { units: unitId },
      },
      { new: true }
    );
  }
  async pullUnit(id: string | ObjectId, unitId: string | ObjectId) {
    const company = await this.read(id);
    if (!company) return null;
    return await this.companyModel.findByIdAndUpdate(
      id,
      {
        $pull: { units: unitId },
      },
      { new: true }
    );
  }
}

export const CompanyDAO = CompanyDAOSingleton.getInstance();
