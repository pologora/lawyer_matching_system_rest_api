import { buildUpdateTableRowQuery } from '../../helpers/buildUpdateTableRowQuery';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { CreateUserDto, UpdateUserDto } from './dto';
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
  const tableName = 'User';

  const { query, values } = buildUpdateTableRowQuery(data, tableName);

  await User.update({ id, query, values });

  return await User.getOne({ id });
};

export const removeUserService = async ({ id }: RemoveUserServiceProps) => {
  return await User.remove({ id });
};
