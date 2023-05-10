import { Model } from "mongoose";
import { Company, CompanyModel } from "../models/company";
import { UserDAO } from "./userDAO";

interface ICompanyDAO {
  companyModel: Model<Company>;

  create: (data: Company) => Promise<Company | null>;
  read: (id: string) => Promise<Company | null>;
  update: (
    id: string,
    data: Omit<Company, "users" | "units">
  ) => Promise<Company | null>;
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
    // const companyCreated = await this.companyModel.create(data);
    // const updateCompany TODO: update company via CompanyDAO
    return await createdCompany.save();
  }
  async read(id: string) {
    const companyModel = await this.companyModel.findById(id);
    if (!companyModel) {
      return null;
    }
    return companyModel;
  }

  // Not possible to update users and units using this method: use push and pull methods instead
  async update(id: string, newData: Omit<Company, "users" | "units">) {
    const companyModel = await this.read(id);
    // const updateCompany TODO: update company via CompanyDAO
    if (!companyModel) return null;
    return await companyModel.updateOne(newData, { new: true });
  }
  async delete(id: string) {
    const companyModel = await this.read(id);
    if (!companyModel) return null;
    const deletedModel = await companyModel
      .deleteOne()
      .then(() => companyModel);
    return deletedModel;
  }
  async addCompanyUser(id: string, userId: string) {
    const companyModel = await this.read(id);
    // const updateCompany TODO: update company via CompanyDAO
    if (!companyModel) return null;
    const updatedUser = await UserDAO.addCompany(userId, companyModel.id);
    const updatedCompany = await companyModel.updateOne(
      {
        $push: { users: userId },
      },
      { new: true }
    );
    return updatedCompany;
  }

  async removeCompanyUser(id: string, userId: string) {
    const companyModel = await this.read(id);
    // const updateCompany TODO: update company via CompanyDAO
    if (!companyModel) return null;
    const updatedUser = await UserDAO.removeCompany(userId);
    const updatedCompany = await companyModel.updateOne(
      {
        $pull: { users: userId },
      },
      { new: true }
    );
    return updatedCompany;
  }

  // Update Company User DAO Method
}

export const CompanyDAO = CompanyDAOSingleton.getInstance();
