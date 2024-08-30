import { ResultSetHeader } from 'mysql2';
import { CRUDModel } from '../../../core/types/CRUDModelTypes';
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
