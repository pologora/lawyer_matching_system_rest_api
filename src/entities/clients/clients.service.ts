import { buildCreateTableRowQuery } from '../../helpers/buildCreateTableRowQuery';
import { buildUpdateTableRowQuery } from '../../helpers/buildUpdateTableRowQuery';
import { User } from '../users/users.model';
import { ClientProfile } from './clients.model';
import { CreateClientDto, UpdateClientDto } from './dto';

type CreateClientServiceProps = {
  data: CreateClientDto;
};

type GetClientServiceProps = {
  id: number;
};

type UpdateClientServiceProps = {
  id: number;
  data: UpdateClientDto;
};

type RemoveClienServiceProps = {
  id: number;
};

export const createClientService = async ({ data }: CreateClientServiceProps) => {
  const { userId } = data;
  const { query: createUserQuery, values } = buildCreateTableRowQuery(data, 'ClientProfile');

  const clientId = await ClientProfile.create({ createUserQuery, values });

  await User.setRole({ id: userId, role: 'client' });

  return await ClientProfile.getOne({ id: clientId });
};

export const getClientService = async ({ id }: GetClientServiceProps) => {
  return await ClientProfile.getOne({ id });
};

export const getManyClientsService = async () => {
  return await ClientProfile.getMany();
};

export const updateClientService = async ({ id, data }: UpdateClientServiceProps) => {
  const { query, values } = buildUpdateTableRowQuery(data, 'ClientProfile');

  await ClientProfile.update({ id, query, values });

  return await ClientProfile.getOne({ id });
};

export const removeClientService = async ({ id }: RemoveClienServiceProps) => {
  await ClientProfile.remove({ id });

  return await User.setRole({ id, role: 'user' });
};
