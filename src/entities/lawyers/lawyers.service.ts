import { User } from '../users/users.model';
import { CreateLawyerDto, UpdateLawyerDto } from './dto';
import { GetManyLawyersQueryStringDto } from './dto/getManyLawyersQueryStringDto';
import { buildGetManyLawyersQuery } from './helpers/biuldGetManyLawyersQuery';
import { buildCreateTableRowQuery } from '../../helpers/buildCreateTableRowQuery';
import { buildUpdateTableRowQuery } from '../../helpers/buildUpdateTableRowQuery';
import { LawyersProfile } from './lawyers.model';

export const getManyLawyersService = async (queryString: GetManyLawyersQueryStringDto) => {
  const query = buildGetManyLawyersQuery(queryString);

  return await LawyersProfile.getMany(query);
};

export const getLawyerService = async (id: number) => {
  const result = await LawyersProfile.getOne(id);

  return result;
};

export const createLawyerService = async (data: CreateLawyerDto) => {
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

  await User.setRole('lawyer', userId);

  return await LawyersProfile.getOne(lawyerId!);
};

export const updateLawyerService = async (data: UpdateLawyerDto, id: number) => {
  const { specializations } = data;

  if (specializations?.length) {
    await LawyersProfile.updateLawyerSpecializations({ lawyerId: id, specializationsIds: specializations });
    delete data.specializations;
  }

  const { query, values } = buildUpdateTableRowQuery(data, 'LawyerProfile');

  await LawyersProfile.update({ query, values, id });

  return await LawyersProfile.getOne(id);
};

export const removeLawyerService = async (id: number) => {
  return await LawyersProfile.remove(id);
};
