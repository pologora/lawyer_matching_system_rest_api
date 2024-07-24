import { buildCreateTableRowQuery } from '../../helpers/buildCreateTableRowQuery';
import { buildUpdateTableRowQuery } from '../../helpers/buildUpdateTableRowQuery';
import { User } from '../users/users.model';
import { ClientProfile } from './clients.model';
import { CreateClientDto, UpdateClientDto } from './dto';

export const getClientService = async (id: number) => {
  return await ClientProfile.getOne(id);
};

export const getManyClientsService = async () => {
  return await ClientProfile.getMany();
};

export const updateClientService = async (id: number, data: UpdateClientDto) => {
  const { query, values } = buildUpdateTableRowQuery(data, 'ClientProfile');

  await ClientProfile.update(query, values, id);

  return await ClientProfile.getOne(id);
};

export const createClientService = async (data: CreateClientDto) => {
  const { userId } = data;
  const { query, values } = buildCreateTableRowQuery(data, 'ClientProfile');

  const clientId = await ClientProfile.create(query, values);

  await User.setRole({ role: 'client', id: userId });

  return await ClientProfile.getOne(clientId);
};

export const removeClientService = async (id: number) => {
  return await ClientProfile.remove(id);
};
