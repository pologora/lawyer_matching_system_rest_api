import { CreateLawyerService, UpdateLawyerService } from './types/lawyersTypes';

export const createLawyerService: CreateLawyerService =
  ({ LawyersProfile, User, buildCreateTableRowQuery, getLawyerByIdQuery, createLawyerSpecializationsQuery }) =>
  async ({ data }) => {
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

    const lawyerId = await LawyersProfile.createLawyer({
      createLawyerSpecializationsQuery,
      getLawyerByIdQuery,
      query,
      specializations,
      values,
    });

    await User.setRole({ id: userId, role: 'lawyer' });

    return await LawyersProfile.getOne({ id: lawyerId, query: getLawyerByIdQuery });
  };

export const updateLawyerService: UpdateLawyerService =
  ({
    LawyersProfile,
    buildUpdateTableRowQuery,
    getLawyerByIdQuery,
    deleteLawyerSpecializationsQuery,
    createLawyerSpecializationsQuery,
  }) =>
  async ({ data, id }) => {
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

    const { query, values } = buildUpdateTableRowQuery(data, 'LawyerProfile');

    await LawyersProfile.update({ id, query, values });

    return await LawyersProfile.getOne({ id, query: getLawyerByIdQuery });
  };
