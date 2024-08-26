import { CreateLawyerService, UpdateLawyerService } from './types/lawyersTypes';

export const createLawyerService: CreateLawyerService =
  ({ LawyersProfile, User, buildCreateTableRowQuery }) =>
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

    const lawyerId = await LawyersProfile.create({ query, specializations, values });

    await User.setRole({ id: userId, role: 'lawyer' });

    return await LawyersProfile.getOne({ id: lawyerId! });
  };

export const updateLawyerService: UpdateLawyerService =
  ({ LawyersProfile, buildUpdateTableRowQuery }) =>
  async ({ data, id }) => {
    const { specializations } = data;

    await LawyersProfile.getOne({ id });

    if (specializations?.length) {
      await LawyersProfile.updateLawyerSpecializations({
        lawyerId: id,
        specializationsIds: specializations,
      });

      delete data.specializations;
    }

    const { query, values } = buildUpdateTableRowQuery(data, 'LawyerProfile');

    await LawyersProfile.update({ id, query, values });

    return await LawyersProfile.getOne({ id });
  };
