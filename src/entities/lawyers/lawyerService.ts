import { CreateLawyerService, UpdateLawyerService } from './types/lawyersTypes';

export const createLawyerService: CreateLawyerService = async ({
  LawyersProfile,
  User,
  buildInsertQuery,
  getLawyerByIdQuery,
  createLawyerSpecializationsQuery,
  updateUserRoleQuery,
  data,
}) => {
  const { userId, licenseNumber, bio, experience, firstName, lastName, cityId, regionId, specializations } = data;

  const { query, values } = buildInsertQuery(
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

  const lawyerId = await LawyersProfile.create({
    createLawyerSpecializationsQuery,
    getLawyerByIdQuery,
    query,
    specializations,
    values,
  });

  await User.setRole({ id: userId, role: 'lawyer', updateUserRoleQuery });

  return await LawyersProfile.getOne({ id: lawyerId, query: getLawyerByIdQuery });
};

export const updateLawyerService: UpdateLawyerService = async ({
  LawyersProfile,
  buildUpdateQuery,
  getLawyerByIdQuery,
  deleteLawyerSpecializationsQuery,
  createLawyerSpecializationsQuery,
  data,
  id,
}) => {
  const { specializations } = data;

  await LawyersProfile.getOne({ id, query: getLawyerByIdQuery });

  if (specializations?.length) {
    await LawyersProfile.updateLawyerSpecializations({
      createLawyerSpecializationsQuery,
      deleteLawyerSpecializationsQuery,
      lawyerId: id,
      specializationsIds: specializations,
    });

    delete data.specializations;
  }

  if (Object.keys(data).length) {
    const { query, values } = buildUpdateQuery(data, 'LawyerProfile');

    await LawyersProfile.update({ id, query, values });
  }

  return await LawyersProfile.getOne({ id, query: getLawyerByIdQuery });
};
