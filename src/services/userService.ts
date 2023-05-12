import { User } from "../models/user";
import { UserDAO } from "../db/userDAO";
import { BadInputError, NotFoundError } from "../utils/error";
interface IUserService {
  userDAO: typeof UserDAO;

  create: (data: User) => Promise<User>;
  read: (id: string) => Promise<User>;
  update: (id: string, data: Partial<User>) => Promise<User>;
  delete: (id: string) => Promise<User>;
}

class UserServiceSingleton implements IUserService {
  private static instance: UserServiceSingleton;
  userDAO;
  private constructor() {
    this.userDAO = UserDAO;
  }
  // Singleton Pattern
  public static getInstance(): UserServiceSingleton {
    if (!UserServiceSingleton.instance) {
      UserServiceSingleton.instance = new UserServiceSingleton();
    }
    return UserServiceSingleton.instance;
  }
  async create(data: User) {
    const { email } = data;
    const emailAlreadyRegistered = !!(await this.userDAO.findByEmail(email));
    if (emailAlreadyRegistered) {
      throw new BadInputError("Invalid e-mail");
    }
    // TODO: intercept auth - company user
    const userCreated = await this.userDAO.create(data);
    return userCreated;
  }
  async read(id: string) {
    // TODO: intercept auth - owner
    const user = await this.userDAO.get(id);
    return user;
  }
  async update(id: string, data: Partial<User>) {
    // TODO: intercept auth - owner
    const user = await this.userDAO.update(id, data);
    return user;
  }

  async delete(id: string) {
    // TODO: intercept auth - owner
    const user = await this.userDAO.delete(id);
    return user;
  }
}

export const UserService = UserServiceSingleton.getInstance();
