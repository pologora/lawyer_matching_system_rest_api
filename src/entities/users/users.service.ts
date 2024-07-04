import { patchQueryBuilder } from '../../helpers/patchQueryBuilder';
import { CreateUser } from './dto/createUser.dto';
import { UpdateUser, UpdateUserKey } from './dto/updateUser.dto';
import { User } from './users.model';

export const createUser = async (data: CreateUser) => {
  const { email, password } = data;

  const idxOfEmailSymbol = email.indexOf('@');
  const zeroIdx = 0;
  const username = email.substring(zeroIdx, idxOfEmailSymbol);

  const hashedPassword = password;

  const result = await User.create({ username, email, hashedPassword });

  return result;
};

export const updateUser = async (id: string, data: UpdateUser) => {
  const allowedKeys: Set<UpdateUserKey> = new Set(['username', 'email']);
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
