import { UserRole } from '../../../types/userRoles';

export interface GetMeDto {
  role: UserRole;
  userId: number;
}
