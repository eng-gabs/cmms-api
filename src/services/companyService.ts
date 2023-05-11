import { Company } from "../models/company";
import { CompanyDAO } from "../db/companyDAO";
import { Err, Result } from "../utils/error";
import { ObjectId } from "mongoose";
import { AssetDAO } from "../db/assetDAO";

const CompanyNotFound: (id: string) => Err = (id) => {
  return {
    message: `Empresa com id ${id} não encontrado`,
    status: 404,
  };
};

// const EmailAlreadyRegisteredError: Err = {
//   message: "E-mail inválido",
//   status: 422,
// };

type CompanyErrors = ReturnType<typeof CompanyNotFound>;

type CompanyResult = Result<Company, CompanyErrors>;

interface ICompanyService {
  companyDAO: typeof CompanyDAO;

  create: (data: Company) => Promise<CompanyResult>;
  read: (id: string) => Promise<CompanyResult>;
  update: (id: string, data: Partial<Company>) => Promise<CompanyResult>;
  delete: (id: string) => Promise<CompanyResult>;
}

class CompanyServiceSingleton implements ICompanyService {
  private static instance: CompanyServiceSingleton;
  companyDAO;
  private constructor() {
    this.companyDAO = CompanyDAO;
  }
  // Singleton Pattern
  public static getInstance(): CompanyServiceSingleton {
    if (!CompanyServiceSingleton.instance) {
      CompanyServiceSingleton.instance = new CompanyServiceSingleton();
    }
    return CompanyServiceSingleton.instance;
  }
  async create(data: Company) {
    // TODO: intercept auth - company company
    const companyCreated = await this.companyDAO.create(data);
    return { data: companyCreated };
  }
  async read(id: string) {
    // TODO: intercept auth - owner
    const company = await this.companyDAO.getCompanyWithObjects(id);
    if (!company) return { error: CompanyNotFound(id) };
    return { data: company };
  }
  async update(id: string, data: Partial<Company>) {
    // TODO: intercept auth - owner
    const company = await this.companyDAO.update(id, data);
    if (!company) return { error: CompanyNotFound(id) };
    return { data: company };
  }

  async delete(id: string) {
    // TODO: intercept auth - owner
    const company = await this.companyDAO.delete(id);
    if (!company) return { error: CompanyNotFound(id) };
    return { data: company };
  }

  async getCompanyUnitsAssetsSummary(companyId: string) {
    const company = await CompanyDAO.read(companyId);
    if (!company) return { error: CompanyNotFound(companyId) };
    const unitIds = company.units;

    const healthLevels = await AssetDAO.getAssetsHealthLevelCount(unitIds, 1);
    const status = await AssetDAO.getAssetStatusCount(unitIds);

    return { data: status };
  }
}

export const CompanyService = CompanyServiceSingleton.getInstance();
