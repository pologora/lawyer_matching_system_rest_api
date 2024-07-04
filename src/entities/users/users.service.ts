import { patchQueryBuilder } from '../../helpers/patchQueryBuilder';
import { AppError } from '../../utils/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { CreateUser } from './dto/createUser.dto';
import { UpdateUser } from './dto/updateUser.dto';
import { User } from './users.model';

export const createUser = async (data: CreateUser) => {
  const { name, email, password } = data;

  const hashedPassword = password;

  const result = await User.create({ name, email, hashedPassword });

  return result;
};

export const updateUser = async (id: string, data: UpdateUser) => {
  const allowedKeys = new Set(['name', 'email']);
  const tableName = 'users';

  const { query, values } = patchQueryBuilder(tableName, data, allowedKeys);

  await User.update(query, values, id);

  const updatedUser = User.get(id);

  return updatedUser;
};

export const getUser = async (id: string) => {
  const user = await User.get(id);

  return user;
};

export const getAllUsers = async () => {
  const users = await User.getAll();

  return users;
};

export const removeUser = async (id: string) => {
  const result = await User.remove(id);

  return result;
};
