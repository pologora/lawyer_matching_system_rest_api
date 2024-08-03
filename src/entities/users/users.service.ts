import { buildUpdateTableRowQuery } from '../../helpers/buildUpdateTableRowQuery';
import { AppError } from '../../utils/errors/AppError';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
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

type UploadUserPhotoService = {
  id: number;
  profileImageFileName: string;
};

export const createUserService = async ({ data }: CreateUserServiceProps) => {
  const { email, password } = data;

  const hashedPassword = await hashPassword(password);

  return await User.create({ email, hashedPassword });
};

export const getUserService = async ({ id }: GetUserServiceProps) => {
  const user = await User.getOne({ id });

  if (!user) {
    throw new AppError(`User id: ${id} not exists`, HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  return user;
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

export const uploadUserPhotoService = async ({ id, profileImageFileName }: UploadUserPhotoService) => {
  const { query, values } = buildUpdateTableRowQuery({ profileImageFileName }, 'User');

  await User.update({ id, query, values });
};
