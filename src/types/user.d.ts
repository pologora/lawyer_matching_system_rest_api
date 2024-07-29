import { UserRole } from './userRoles';

export interface IUser {
  userId: number;
  email: string;
  role: UserRole;
  passwordChangedAt: Date | null;
  password?: string;
  resetPasswordTokenExpiration: Date | null;
  active: boolean;
  token?: string;
  googleId?: string;
}
