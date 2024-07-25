import { patchQueryBuilder } from '../../helpers/patchQueryBuilder';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { CreateUserDto, UpdateUserDto, UpdateUserKey } from './dto';
import { User } from './users.model';

type CreateUserServiceProps = {
  data: CreateUserDto;
};

type GetUserServiceProps = {
  id: number;
};

type UpdateUserServiceProps = {
  id: number;
  data: UpdateUserDto;
};

type RemoveUserServiceProps = {
  id: number;
};

export const createUserService = async ({ data }: CreateUserServiceProps) => {
  const { email, password } = data;

  const hashedPassword = await hashPassword(password);

  return await User.create({ email, hashedPassword });
};

export const getUserService = async ({ id }: GetUserServiceProps) => {
  return await User.getOne({ id });
};

export const getManyUsersService = async () => {
  return await User.getMany();
};

export const updateUserService = async ({ id, data }: UpdateUserServiceProps) => {
  const allowedKeys: Set<UpdateUserKey> = new Set(['email']);
  const tableName = 'User';

  const { query, values } = patchQueryBuilder(tableName, data, allowedKeys);

  await User.update({ id, query, values });

  return await User.getOne({ id });
};

export const removeUserService = async ({ id }: RemoveUserServiceProps) => {
  return await User.remove({ id });
};
