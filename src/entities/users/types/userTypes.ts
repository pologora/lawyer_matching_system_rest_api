import { QueryResult, ResultSetHeader } from 'mysql2';
import { UserRole } from '../../../types/userRoles';
import { IUser } from '../../../types/user';
import { BuildUpdateTableRowQuery, HashPassword } from '../../../types/utils';
import { NextFunction, Response, Request } from 'express';

export interface GetManyUsersQueryParams {
  role?: UserRole;
  limit?: number;
  page?: number;
  sort?: string;
  order?: 'desc' | 'asc';
  search?: string;
  isVerified?: boolean;
  columns?: string;
}

export type BuildGetManyUsersQuery = (queryString: GetManyUsersQueryParams) => {
  query: string;
  values: (string | number | boolean)[];
};

export type CreateProps = {
  email: string;
  hashedPassword: string;
};

export type GetOneProps = {
  id: number;
};

export type GetOneForAuthProps = {
  id: number;
};

export type GetManyProps = {
  values: (string | number | boolean)[];
  query: string;
};

export type UpdateProps = {
  query: string;
  values: (string | number)[];
  id: number;
};

export type RemoveProps = {
  id: number;
};

export type SetRoleProps = {
  id: number;
  role: UserRole;
};

export interface UserModel {
  create(props: CreateProps): Promise<ResultSetHeader>;
  getOne(props: GetOneProps): Promise<IUser>;
  getOneForAuth(props: GetOneForAuthProps): Promise<IUser>;
  getMany(props: GetManyProps): Promise<QueryResult>;
  update(props: UpdateProps): Promise<ResultSetHeader>;
  remove(props: RemoveProps): Promise<ResultSetHeader>;
  setRole(props: SetRoleProps): Promise<ResultSetHeader>;
}

export type CreateUserController = (props: {
  User: UserModel;
  hashPassword: HashPassword;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetUserController = (props: {
  User: UserModel;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetManyUsersController = (props: {
  User: UserModel;
  buildGetManyUsersQuery: BuildGetManyUsersQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type UpdateUserController = (props: {
  User: UserModel;
  buildUpdateTableRowQuery: BuildUpdateTableRowQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type RemoveUserController = (props: {
  User: UserModel;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type UploadUserPhotoController = (props: {
  User: UserModel;
  buildUpdateTableRowQuery: BuildUpdateTableRowQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
