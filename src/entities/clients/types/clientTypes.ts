import { NextFunction, Response, Request } from 'express';
import { RowDataPacket } from 'mysql2';
import { BuildCreateTableRowQuery, BuildUpdateTableRowQuery } from '../../../types/utils';
import { UserModel } from '../../users/types/userTypes';
import { CRUDModel } from '../../../types/CRUDModel';

export type GetOneByUserIdProps = {
  userId: number;
  query: string;
};

export interface ClientProfileModel extends CRUDModel {
  getOneByUserId(props: GetOneByUserIdProps): Promise<RowDataPacket>;
}

export type CreateClientController = (props: {
  User: UserModel;
  ClientProfile: ClientProfileModel;
  getOneClientQuery: string;
  buildCreateTableRowQuery: BuildCreateTableRowQuery;
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
  buildUpdateTableRowQuery: BuildUpdateTableRowQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type RemoveClientController = (props: {
  ClientProfile: ClientProfileModel;
  query: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
