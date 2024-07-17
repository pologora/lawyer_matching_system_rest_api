import { User } from '../users/users.model';
import { CreateLawyerDto, UpdateLawyerDto } from './dto';
import { buildCreateLawyerQuery } from './helpers/buildCreateLawyerQuery';
import { buildUpdateLawyerQuery } from './helpers/buildUpdateLawyerQuery';
import { LawyersProfile } from './lawyers.model';

export const getManyLawyersService = async () => {
  const result = await LawyersProfile.getMany();

  return result;
};

export const getLawyerService = async (id: number) => {
  const result = await LawyersProfile.getOne(id);

  return result;
};

export const createLawyerService = async (data: CreateLawyerDto) => {
  const { user_id, license_number, bio, experience, first_name, last_name, city, region, specializations } = data;

  const { query, values } = buildCreateLawyerQuery({
    user_id,
    license_number,
    bio,
    experience,
    first_name,
    last_name,
    city,
    region,
  });

  const lawyerId = await LawyersProfile.create({ query, values, specializations });

  await User.setRole('lawyer', user_id);

  return await LawyersProfile.getOne(lawyerId!);
};

export const updateLawyerService = async (data: UpdateLawyerDto, id: number) => {
  const { specializations } = data;

  if (specializations?.length) {
    await LawyersProfile.updateLawyerSpecializations({ lawyerId: id, specializationsIds: specializations });
    delete data.specializations;
  }

  const { query, values } = buildUpdateLawyerQuery(data);

  await LawyersProfile.update({ query, values, id });

  return await LawyersProfile.getOne(id);
};

export const removeLawyerService = async (id: number) => {
  const result = await LawyersProfile.remove(id);

  return result;
};
