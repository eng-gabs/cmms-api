import { User } from "../models/user";
import { UserDAO } from "../db/userDAO";
import { Err, Result } from "../utils/error";

const UserNotFound: (id: string) => Err = (id) => {
  return {
    message: `Usuário com id ${id} não encontrado`,
    status: 404,
  };
};

const EmailAlreadyRegisteredError: Err = {
  message: "E-mail inválido",
  status: 422,
};

type UserErrors =
  | ReturnType<typeof UserNotFound>
  | typeof EmailAlreadyRegisteredError;

type UserResult = Result<User, UserErrors>;

interface IUserService {
  userDAO: typeof UserDAO;

  create: (data: User) => Promise<UserResult>;
  read: (id: string) => Promise<UserResult>;
  update: (id: string, data: Partial<User>) => Promise<UserResult>;
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
      return { error: EmailAlreadyRegisteredError };
    }
    // TODO: intercept auth - company user
    const userCreated = await this.userDAO.create(data);
    return { data: userCreated };
  }
  async read(id: string) {
    // TODO: intercept auth - owner
    const user = await this.userDAO.get(id);
    if (!user) return { error: UserNotFound(id) };
    return { data: user };
  }
  async update(id: string, data: Partial<User>) {
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
