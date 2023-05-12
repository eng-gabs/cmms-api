import { Company } from "../models/company";
import { CompanyDAO } from "../db/companyDAO";
import { AssetDAO } from "../db/assetDAO";
interface ICompanyService {
  companyDAO: typeof CompanyDAO;

  create: (data: Company) => Promise<Company>;
  read: (id: string) => Promise<Company>;
  update: (id: string, data: Partial<Company>) => Promise<Company>;
  delete: (id: string) => Promise<Company>;
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
    return companyCreated;
  }
  async read(id: string) {
    // TODO: intercept auth - owner
    const company = await this.companyDAO.getCompanyWithObjects(id);
    return company;
  }
  async update(id: string, data: Partial<Company>) {
    // TODO: intercept auth - owner
    const company = await this.companyDAO.update(id, data);
    return company;
  }

  async delete(id: string) {
    // TODO: intercept auth - owner
    const company = await this.companyDAO.delete(id);
    return company;
  }

  async getCompanyUnitsAssetsSummary(companyId: string) {
    const company = await CompanyDAO.read(companyId);
    const unitIds = company.units;

    const healthLevels = await AssetDAO.getAssetsHealthLevelCount(unitIds, 1);
    const status = await AssetDAO.getAssetStatusCount(unitIds);

    return { data: status };
  }
}

export const CompanyService = CompanyServiceSingleton.getInstance();
