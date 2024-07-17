import { patchQueryBuilder } from '../../helpers/patchQueryBuilder';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { CreateUserDto, UpdateUserDto, UpdateUserKey } from './dto';
import { User } from './users.model';

export const createUserService = async (data: CreateUserDto) => {
  const { email, password } = data;

  const hashedPassword = await hashPassword(password);

  return await User.create({ email, hashedPassword });
};

export const updateUserService = async (id: number, data: UpdateUserDto) => {
  const allowedKeys: Set<UpdateUserKey> = new Set(['email']);
  const tableName = 'users';

  const { query, values } = patchQueryBuilder(tableName, data, allowedKeys);

  await User.update(query, values, id);

  return await User.getOne(id);
};

export const getUserService = async (id: number) => {
  return await User.getOne(id);
};

export const getManyUsersService = async () => {
  return await User.getMany();
};

export const removeUserService = async (id: number) => {
  return await User.remove(id);
};
