import { ResultSetHeader } from 'mysql2';
import { BuildRemoveQuery, BuildUpdateQuery, HashPassword } from '../../../types/utils';
import { NextFunction, Response, Request } from 'express';
import { CRUDModel } from '../../../types/core/CRUDModel';
import { UserRole } from '../../../types/IUser';

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

export type SetRoleProps = {
  id: number;
  role: UserRole;
  updateUserRoleQuery: string;
};

export type GetOneForAuthProps = {
  id: number;
  query: string;
};

export interface UserModel extends CRUDModel {
  setRole(props: SetRoleProps): Promise<ResultSetHeader>;
}

export type CreateUserController = (props: {
  User: UserModel;
  query: string;
  hashPassword: HashPassword;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetUserController = (props: {
  User: UserModel;
  query: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetManyUsersController = (props: {
  User: UserModel;
  buildGetManyUsersQuery: BuildGetManyUsersQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type UpdateUserController = (props: {
  User: UserModel;
  buildUpdateTableRowQuery: BuildUpdateQuery;
  getUserByIdQuery: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type RemoveUserController = (props: {
  User: UserModel;
  buildRemoveQuery: BuildRemoveQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type UploadUserPhotoController = (props: {
  User: UserModel;
  buildUpdateTableRowQuery: BuildUpdateQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
