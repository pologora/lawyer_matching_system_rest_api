import { User } from '../users/users.model';
import { CreateLawyerDto, UpdateLawyerDto } from './dto';
import { getCreateLawyerQuery } from './helpers/getCreateLawyerQuery';
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

  const { query, values } = getCreateLawyerQuery({
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
  // const result = await LawyersProfile.update();
  // return result;
};

export const removeLawyerService = async (id: number) => {
  const result = await LawyersProfile.remove(id);

  return result;
};
