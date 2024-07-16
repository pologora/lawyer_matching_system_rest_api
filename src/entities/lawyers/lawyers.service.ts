import { CreateLawyerDto } from './dto';
import { createLawyerQuery } from './helpers/createLawyerQuery';
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

  const { query, values } = createLawyerQuery({
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

  const lawyerProfile = await LawyersProfile.getOne(lawyerId!);

  return lawyerProfile;
};

export const updateLawyer = async () => {
  //   const result = await LawyersProfile.update();
  //   return result;
};

export const removeLawyer = async (id: number) => {
  const result = await LawyersProfile.remove(id);

  return result;
};
