export type UserRole = 'admin' | 'user' | 'client' | 'lawyer';

export interface IUser {
  userId: number;
  email: string;
  role: UserRole;
  passwordChangedAt: Date | null;
  password?: string;
  resetPasswordTokenExpiration: Date | null;
  isVerified: boolean;
  token?: string;
  googleId?: string;
  emailVerificationToken: string | null;
  emailVerificationTokenExpiration: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
