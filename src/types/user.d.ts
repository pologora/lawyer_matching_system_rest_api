import { UserRole } from './userRoles';

export interface IUser {
  id: number;
  email: string;
  role: UserRole;
  passwordChangedAt: Date | null;
  password?: string;
  resetPasswordTokenExpiration: Date | null;
}
