import { CreateClientService } from './types/clientTypes';

export const createClientService: CreateClientService = async ({
  ClientProfile,
  buildInsertQuery,
  User,
  getOneClientQuery,
  updateUserRoleQuery,
  data,
}) => {
  const { query, values } = buildInsertQuery(data, 'ClientProfile');

  const clientId = await ClientProfile.create({ query, values });

  await User.setRole({ id: data.userId, role: 'client', updateUserRoleQuery });

  return await ClientProfile.getOne({ id: clientId, query: getOneClientQuery });
};
