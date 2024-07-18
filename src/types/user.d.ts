import { UserRole } from './userRoles';

export interface IUser {
  id: number;
  email: string;
  role: UserRole;
  password_changed_at: Date | null;
  password?: string;
  reset_password_token_expiration: Date | null;
}
