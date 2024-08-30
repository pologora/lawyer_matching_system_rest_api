import { RowDataPacket } from 'mysql2';
import { BuildInsertQuery } from '../../../types/utils';
import { UserModel } from '../../users/types/userTypes';
import { CRUDModel } from '../../../core/types/CRUDModelTypes';

type GetManyClientsQueryParams = {
  limit?: number;
  page?: number;
};

export type BuildGetManyClientsQuery = (params: GetManyClientsQueryParams) => {
  query: string;
  values: (string | number)[];
};

export type GetOneByUserIdProps = {
  userId: number;
  query: string;
};

export interface ClientModel extends CRUDModel {
  getOneByUserId(props: GetOneByUserIdProps): Promise<RowDataPacket>;
}

type CreateClientDto = {
  firstName: string;
  lastName: string;
  userId: number;
};

type CreateClientServiceProps = {
  User: UserModel;
  ClientProfile: ClientModel;
  getOneClientQuery: string;
  updateUserRoleQuery: string;
  buildInsertQuery: BuildInsertQuery;
  data: CreateClientDto;
};

export type CreateClientService = (props: CreateClientServiceProps) => Promise<RowDataPacket>;
