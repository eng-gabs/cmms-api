import { Model } from "mongoose";
import { User, UserModel } from "../models/user";
import { CompanyDAO } from "./companyDAO";

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
    await CompanyDAO.pushUser(data.company, createdUser.id);
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
    const user = await this.read(id);
    if (!user) return null;
    // if user is linking a company, link user in company collection (apenas para user - update deve ser unidirecional)
    if (newData.company) {
      await CompanyDAO.pushUser(newData.company, user.id);
      // if user had already a company, remove from old one
      if (user.company && user.company !== newData.company) {
        await CompanyDAO.pullUser(user.company, id);
      }
    }
    return await this.userModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
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
}

export const UserDAO = UserDAOSingleton.getInstance();
