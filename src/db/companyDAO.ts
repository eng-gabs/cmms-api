import { Model } from "mongoose";
import { Company, CompanyModel } from "../models/company";
import { UserDAO } from "./userDAO";
import { User } from "../models/user";

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
  /* 
  Dois casos de uso: 
    1. usuário quer atualizar toda a company com uma lista de usuarios
    2. usuario quer adicionar ou remover um usuario dessa lista

    a nivel de dao é necessario implementar os dois casos por conta de performance?
  */
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
  // TODO: remover gambiarra -> update 1:n em uma única direção: não é possível adicionar uma company pelo user, apenas por company (push e pull)
  // TODO: UNIT DAO VAI SEGUIR ESSA LOGICA!
  async addCompanyUser(id: string, user: User, updateUser?: boolean) {
    const companyModel = await this.read(id);
    if (!companyModel) return null;
    if (updateUser) await UserDAO.addCompany(user.id, companyModel.id);
    companyModel.users.push(user.id);
    return await companyModel.save();
  }

  async removeCompanyUser(id: string, userId: string, updateUser?: boolean) {
    const companyModel = await this.read(id);
    if (!companyModel) return null;
    if (updateUser) await UserDAO.removeCompany(userId);
    const updatedCompany = await companyModel.updateOne(
      {
        $pull: { users: userId },
      },
      { new: true }
    );
    return updatedCompany;
  }
}

export const CompanyDAO = CompanyDAOSingleton.getInstance();
