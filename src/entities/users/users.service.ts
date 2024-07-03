import { patchQueryBuilder } from '../../helpers/patchQueryBuilder';
import { CreateUser } from './dto/createUser.dto';
import { UpdateUser } from './dto/updateUser.dto';
import { User } from './users.model';

export const createUser = async (data: CreateUser) => {
  const { name, email, password, confirmPassword } = data;

  const hashedPassword = password;

  const result = await User.create({ name, email, hashedPassword });

  return result;
};

export const updateUser = async (id: string, data: UpdateUser) => {
  const allowedKeys = new Set(['name', 'email']);
  const tableToUpdate = 'users';

  const { query, values } = patchQueryBuilder(tableToUpdate, data, allowedKeys);

  const result = await User.update(query, values, Number(id));

  return result;
};

export const getUser = async (id: string) => {
  const user = await User.get(Number(id));

  return user;
};

export const getAllUsers = async () => {
  const users = await User.getAll();

  return users;
};

export const removeUser = async (id: string) => {
  const result = await User.remove(Number(id));

  return result;
};
