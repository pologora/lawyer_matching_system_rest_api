import { UserRole } from '../../../types/userRoles';

export interface UpdateUserDto {
  role?: UserRole;
  active?: boolean;
}

export type UpdateUserKey = keyof UpdateUserDto;
