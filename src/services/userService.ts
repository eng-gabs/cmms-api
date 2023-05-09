import { User } from "../models/user";
import { UserDAO } from "../db/userDAO";

interface Error {
  message: string;
  status: number; // http status code
}

interface Result<DataType extends Object | null, Err extends Error> {
  data?: DataType;
  error?: Err;
}

const UserNotFound: (id: string) => Error = (id) => {
  return {
    message: `Usuário com id ${id} não encontrado`,
    status: 404,
  };
};

type UserErrors = ReturnType<typeof UserNotFound>;

type UserResult = Result<User, UserErrors>;

interface IUserService {
  userDAO: typeof UserDAO;

  create: (data: User) => Promise<User>;
  read: (id: string) => Promise<UserResult>;
  update: (id: string, data: User) => Promise<UserResult>;
  delete: (id: string) => Promise<UserResult>;
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
      throw Error(`E-mail '${email}' already registered`);
    }
    // TODO: intercept auth - company user
    return await this.userDAO.create(data);
  }
  async read(id: string) {
    // TODO: intercept auth - owner
    const user = await this.userDAO.get(id);
    if (!user) return { error: UserNotFound(id) };
    return { data: user };
  }
  async update(id: string, data: User) {
    // TODO: intercept auth - owner
    const user = await this.userDAO.update(id, data);
    if (!user) return { error: UserNotFound(id) };
    return { data: user };
  }

  async delete(id: string) {
    // TODO: intercept auth - owner
    const user = await this.userDAO.delete(id);
    if (!user) return { error: UserNotFound(id) };
    return { data: user };
  }
}

export const UserService = UserServiceSingleton.getInstance();
