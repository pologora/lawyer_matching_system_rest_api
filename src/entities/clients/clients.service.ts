import { CreateClientService } from './types/clientTypes';

export const createClientService: CreateClientService =
  ({ ClientProfile, buildCreateTableRowQuery, User, getOneClientQuery, updateUserRoleQuery }) =>
  async ({ data }) => {
    const { query, values } = buildCreateTableRowQuery(data, 'ClientProfile');

    const clientId = await ClientProfile.create({ query, values });

    await User.setRole({ id: data.userId, role: 'client', updateUserRoleQuery });

    return await ClientProfile.getOne({ id: clientId, query: getOneClientQuery });
  };
