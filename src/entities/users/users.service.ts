import { patchQueryBuilder } from '../../helpers/patchQueryBuilder';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { CreateUser, UpdateUser, UpdateUserKey } from './dto';
import { User } from './users.model';

export const createUserService = async (data: CreateUser) => {
  const { email, password } = data;

  const hashedPassword = await hashPassword(password);

  const result = await User.create({ email, hashedPassword });

  return result;
};

export const updateUserService = async (id: string, data: UpdateUser) => {
  const allowedKeys: Set<UpdateUserKey> = new Set(['email']);
  const tableName = 'users';

  const { query, values } = patchQueryBuilder(tableName, data, allowedKeys);

  await User.update(query, values, id);

  const updatedUser = User.get(id);

  return updatedUser;
};

export const getUserService = async (id: string) => {
  const user = await User.get(id);

  return user;
};

export const getAllUsersService = async () => {
  const users = await User.getAll();

  return users;
};

export const removeUserService = async (id: string) => {
  const result = await User.remove(id);

  return result;
};
