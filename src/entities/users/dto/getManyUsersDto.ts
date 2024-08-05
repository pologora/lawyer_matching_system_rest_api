import { UserRole } from '../../../types/userRoles';

export interface GetManyUsersDto {
  role?: UserRole;
  limit?: number;
  page?: number;
  sort?: string;
  order?: 'desc' | 'asc';
  search?: string;
  isVerified?: boolean;
  columns?: string;
}
