import { Model } from "mongoose";
import { User, UserModel } from "../models/user";
import { Company } from "../models/company";

interface IUserDAO {
  userModel: Model<User>;

  create: (data: User) => Promise<User | null>;
  read: (id: string) => Promise<User | null>;
  update: (id: string, data: Partial<User>) => Promise<User | null>;
  delete: (id: string) => Promise<User | null>;

  get: (id: string) => Promise<User | null>; // User with Company
  findByEmail: (email: string) => Promise<User | null>; // User with Company
}

export class UserDAOSingleton implements IUserDAO {
  private static instance: UserDAOSingleton;
  userModel;
  constructor() {
    this.userModel = UserModel;
  }
  public static getInstance(): UserDAOSingleton {
    if (!UserDAOSingleton.instance) {
      UserDAOSingleton.instance = new UserDAOSingleton();
    }
    return UserDAOSingleton.instance;
  }
  async create(data: User) {
    const createdUser = new this.userModel(data);
    // const userCreated = await this.userModel.create(data);
    // const updateCompany TODO: update company via CompanyDAO
    return await createdUser.save();
  }
  async read(id: string) {
    const userModel = await this.userModel.findById(id);
    if (!userModel) {
      return null;
      throw Error(`User with id '${id}'not found`);
    }
    return userModel;
  }

  async update(id: string, newData: Partial<User>) {
    const userModel = await this.read(id);
    // const updateCompany TODO: update company via CompanyDAO
    if (!userModel) return null;
    return await userModel.updateOne(newData);
  }
  async delete(id: string) {
    const userModel = await this.read(id);
    if (!userModel) return null;
    const deletedModel = await userModel.deleteOne().then(() => userModel);
    return deletedModel;
  }

  async get(id: string) {
    const userModel = await this.read(id);
    if (!userModel) return null;
    return await userModel.populate("company");
  }

  async findByEmail(email: string) {
    const [user] = await this.userModel.find({ email });
    return user;
  }

  // Update User Company DAO Method

  async addCompany(id: string, company: Company) {
    return await this.update(id, { company: company.id });
  }

  async removeCompany(id: string) {
    const user = await this.read(id);
    if (!user) return null;
    user.company = undefined; // or user.update({ _id: id }, { $unset: { company: 1 }}
    return await user.save();
  }
}

export const UserDAO = UserDAOSingleton.getInstance();