import { Model, ObjectId } from "mongoose";
import { Company, CompanyModel } from "../models/company";
import { User } from "../models/user";
import { UnitDAO } from "./unitDAO";
import { BadInputError, NotFoundError } from "../middlewares/error";

interface ICompanyDAO {
  companyModel: Model<Company>;

  create: (data: Company) => Promise<Company>;
  read: (id: string) => Promise<Company>;
  update: (id: string, data: Partial<Company>) => Promise<Company>;
  delete: (id: string) => Promise<Company>;
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
      throw new NotFoundError("company", id.toString());
    }
    return companyModel;
  }

  async getCompanyWithObjects(id: string) {
    const companyModel = await this.companyModel
      .findById(id)
      .populate("users units");
    if (!companyModel) {
      throw new NotFoundError("company", id);
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
    if (newData.units) {
      throw new BadInputError(
        "Units can not be updated through company endpoint. Use PATCH /api/unit/:id instead."
      );
    }
    if (newData.users) {
      throw new BadInputError(
        "Users can not be updated through company endpoint. Use PATCH /api/user/:id instead."
      );
    }
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      newData,
      {
        new: true,
      }
    );
    return updatedCompany!;
  }
  async delete(id: string) {
    const companyBeforeDelete = await this.read(id);
    await UnitDAO.deleteCompanyUnits(id); // Delete Cascade Units
    await this.companyModel.findByIdAndDelete(id);
    return companyBeforeDelete;
  }
  async pushUser(id: string | ObjectId, userId: string | ObjectId) {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      {
        $push: { users: userId },
      },
      { new: true }
    );
    if (!updatedCompany) throw new NotFoundError("company", id.toString());
    return updatedCompany;
  }

  async pullUser(id: string | ObjectId, userId: string) {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      {
        $pull: { users: userId },
      },
      { new: true }
    );
    if (!updatedCompany) throw new NotFoundError("company", id.toString());
    return updatedCompany;
  }

  async pushUnit(id: string | ObjectId, unitId: string | ObjectId) {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      {
        $push: { units: unitId },
      },
      { new: true }
    );
    if (!updatedCompany) throw new NotFoundError("company", id.toString());
    return updatedCompany;
  }
  async pullUnit(id: string | ObjectId, unitId: string | ObjectId) {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      {
        $pull: { units: unitId },
      },
      { new: true }
    );
    if (!updatedCompany) throw new NotFoundError("company", id.toString());
    return updatedCompany;
  }
}

export const CompanyDAO = CompanyDAOSingleton.getInstance();
