import { NextFunction, Response, Request } from 'express';
import { RowDataPacket } from 'mysql2';
import { BuildInsertQuery, BuildUpdateQuery } from '../../../types/utils';
import { UserModel } from '../../users/types/userTypes';
import { CRUDModel } from '../../../core/types/CRUDModel';

export type GetOneByUserIdProps = {
  userId: number;
  query: string;
};

export interface ClientProfileModel extends CRUDModel {
  getOneByUserId(props: GetOneByUserIdProps): Promise<RowDataPacket>;
}

type CreateClientServiceProps = {
  User: UserModel;
  ClientProfile: ClientProfileModel;
  getOneClientQuery: string;
  updateUserRoleQuery: string;
  buildCreateTableRowQuery: BuildInsertQuery;
};

type CreateClientDto = {
  firstName: string;
  lastName: string;
  userId: number;
};

export type CreateClientService = (
  props: CreateClientServiceProps,
) => (args: { data: CreateClientDto }) => Promise<RowDataPacket>;

export type CreateClientController = (props: {
  createClientService: (args: { data: CreateClientDto }) => Promise<RowDataPacket>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetClientController = (props: {
  ClientProfile: ClientProfileModel;
  query: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetManyClientsController = (props: {
  ClientProfile: ClientProfileModel;
  query: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type UpdateClientController = (props: {
  ClientProfile: ClientProfileModel;
  getOneClientQuery: string;
  buildUpdateTableRowQuery: BuildUpdateQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type RemoveClientController = (props: {
  ClientProfile: ClientProfileModel;
  query: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
