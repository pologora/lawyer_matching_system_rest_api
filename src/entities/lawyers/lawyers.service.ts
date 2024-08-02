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
  const { userId, licenseNumber, bio, experience, firstName, lastName, cityId, regionId, specializations } = data;

  const { query, values } = buildCreateTableRowQuery(
    {
      bio,
      cityId,
      experience,
      firstName,
      lastName,
      licenseNumber,
      regionId,
      userId,
    },
    'LawyerProfile',
  );

  const lawyerId = await LawyersProfile.create({ query, specializations, values });

  await User.setRole({ id: userId, role: 'lawyer' });

  return await LawyersProfile.getOne({ id: lawyerId! });
};

export const getLawyerService = async ({ id }: GetLawyerServiceProps) => {
  const result = await LawyersProfile.getOne({ id });

  return result;
};

export const getManyLawyersService = async ({ queryString }: GetManyLawyersServiceProps) => {
  const { query, values } = buildGetManyLawyersQuery(queryString);

  return await LawyersProfile.getMany({ query, values });
};

export const updateLawyerService = async ({ data, id }: UpdateLawerServiceProps) => {
  const { specializations } = data;

  if (specializations?.length) {
    await LawyersProfile.updateLawyerSpecializations({ lawyerId: id, specializationsIds: specializations });
    delete data.specializations;
  }

  const { query, values } = buildUpdateTableRowQuery(data, 'LawyerProfile');

  await LawyersProfile.update({ id, query, values });

  return await LawyersProfile.getOne({ id });
};

export const removeLawyerService = async ({ id }: RemoveLawyerServiceProps) => {
  return await LawyersProfile.remove({ id });
};
