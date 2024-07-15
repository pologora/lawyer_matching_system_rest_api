import { patchQueryBuilder } from '../../helpers/patchQueryBuilder';
import { AppError } from '../../utils/errors/AppError';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { CreateUserDto, UpdateUserDto, UpdateUserKey } from './dto';
import { User } from './users.model';

export const createUserService = async (data: CreateUserDto) => {
  const { email, password } = data;

  const hashedPassword = await hashPassword(password);

  return await User.create({ email, hashedPassword });
};

export const updateUserService = async (id: string, data: UpdateUserDto) => {
  const allowedKeys: Set<UpdateUserKey> = new Set(['email']);
  const tableName = 'users';

  const { query, values } = patchQueryBuilder(tableName, data, allowedKeys);

  await User.update(query, values, id);

  const user = await User.get(id);

  if (!user) {
    throw new AppError(`Failed to update user id: ${id}`, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }

  return user;
};

export const getUserService = async (id: string) => {
  return await User.get(id);
};

export const getAllUsersService = async () => {
  return await User.getAll();
};

export const removeUserService = async (id: string) => {
  const result = await User.remove(id);

  if (!result.affectedRows) {
    throw new AppError('Failed to delete user.', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
};
