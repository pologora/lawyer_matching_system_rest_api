import { User } from '../users/users.model';
import { CreateLawyerDto, UpdateLawyerDto } from './dto';
import { GetManyLawyersQueryStringDto } from './dto/getManyLawyersQueryStringDto';
import { buildGetManyLawyersQuery } from './helpers/biuldGetManyLawyersQuery';
import { buildCreateTableRowQuery } from '../../helpers/buildCreateTableRowQuery';
import { buildUpdateTableRowQuery } from '../../helpers/buildUpdateTableRowQuery';
import { LawyersProfile } from './lawyers.model';

type CreateLawyerServiceProps = {
  data: CreateLawyerDto;
};

type GetLawyerServiceProps = {
  id: number;
};

type GetManyLawyersServiceProps = {
  queryString: GetManyLawyersQueryStringDto;
};

type UpdateLawerServiceProps = {
  data: UpdateLawyerDto;
  id: number;
};

type RemoveLawyerServiceProps = {
  id: number;
};

export const createLawyerService = async ({ data }: CreateLawyerServiceProps) => {
  const { userId, licenseNumber, bio, experience, firstName, lastName, city, region, specializations } = data;

  const { query, values } = buildCreateTableRowQuery(
    {
      userId,
      licenseNumber,
      bio,
      experience,
      firstName,
      lastName,
      city,
      region,
    },
    'LawyerProfile',
  );

  const lawyerId = await LawyersProfile.create({ query, values, specializations });

  await User.setRole({ role: 'lawyer', id: userId });

  return await LawyersProfile.getOne({ id: lawyerId! });
};

export const getLawyerService = async ({ id }: GetLawyerServiceProps) => {
  const result = await LawyersProfile.getOne({ id });

  return result;
};

export const getManyLawyersService = async ({ queryString }: GetManyLawyersServiceProps) => {
  const query = buildGetManyLawyersQuery(queryString);

  return await LawyersProfile.getMany({ query });
};

export const updateLawyerService = async ({ data, id }: UpdateLawerServiceProps) => {
  const { specializations } = data;

  if (specializations?.length) {
    await LawyersProfile.updateLawyerSpecializations({ lawyerId: id, specializationsIds: specializations });
    delete data.specializations;
  }

  const { query, values } = buildUpdateTableRowQuery(data, 'LawyerProfile');

  await LawyersProfile.update({ query, values, id });

  return await LawyersProfile.getOne({ id });
};

export const removeLawyerService = async ({ id }: RemoveLawyerServiceProps) => {
  return await LawyersProfile.remove({ id });
};
