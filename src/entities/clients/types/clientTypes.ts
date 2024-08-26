import { NextFunction, Response, Request } from 'express';
import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';
import { BuildCreateTableRowQuery, BuildUpdateTableRowQuery } from '../../../types/utils';
import { UserModel } from '../../users/types/userTypes';

export type CreateProps = {
  createUserQuery: string;
  values: (string | number)[];
};

export type GetOneProps = {
  id: number;
};

export type GetOneByUserIdProps = {
  userId: number;
};

export type UpdateProps = {
  query: string;
  values: (string | number)[];
  id: number;
};

export type RemoveProps = {
  id: number;
};

export interface ClientProfileModel {
  create(props: CreateProps): Promise<number>;
  getOne(props: GetOneProps): Promise<RowDataPacket>;
  getOneByUserId(props: GetOneByUserIdProps): Promise<RowDataPacket>;
  getMany(): Promise<QueryResult>;
  update(props: UpdateProps): Promise<ResultSetHeader>;
  remove(props: RemoveProps): Promise<ResultSetHeader>;
}

export type CreateClientController = (props: {
  User: UserModel;
  ClientProfile: ClientProfileModel;
  buildCreateTableRowQuery: BuildCreateTableRowQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetClientController = (props: {
  ClientProfile: ClientProfileModel;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetManyClientsController = (props: {
  ClientProfile: ClientProfileModel;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type UpdateClientController = (props: {
  ClientProfile: ClientProfileModel;
  buildUpdateTableRowQuery: BuildUpdateTableRowQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type RemoveClientController = (props: {
  ClientProfile: ClientProfileModel;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
