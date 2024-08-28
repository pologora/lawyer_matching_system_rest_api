import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { IUser } from '../../../types/IUser';

export type LoginProps = {
  email: string;
  loginUserQuery: string;
};

export type RegisterByEmailProps = {
  email: string;
  password: string;
  emailVerificationTokenExpiration: Date;
  hashedEmailValidationToken: string;
  registerByEmailQuery: string;
};

export type RegisterByGoogle = {
  email: string;
  googleId: string;
  registerByGoogleQuery: string;
};

export type GetUserByEmailProps = {
  email: string;
  getUserByEmailQuery: string;
};

export type SetResetPasswordTokenProps = {
  hashedToken: string;
  expirationInMinutes: number;
  userId: number;
  setResetPasswordTokenQuery: string;
};

export type ClearResetPasswordProps = {
  id: number;
  clearResetPasswordQuery: string;
};

export type UpdatePasswordProps = {
  password: string;
  id: number;
  updateUserPasswordQuery: string;
};

export type GetUserByResetTokenProps = {
  hashedToken: string;
  getUserByResetTokenQuery: string;
};

export type GetUserByEmailVerificationTokenProps = {
  hashedToken: string;
  getUserByEmailVerificationTokenQuery: string;
};

export type DeleteMeProps = {
  id: number;
  deleteMeQuery: string;
};

export type SetUserVerifiedProps = {
  id: number;
  setUserVerifiedQuery: string;
};

export interface AuthModel {
  login(props: LoginProps): Promise<RowDataPacket>;
  registerByEmail(props: RegisterByEmailProps): Promise<ResultSetHeader>;
  registerByGoogle(props: RegisterByGoogle): Promise<ResultSetHeader>;
  getUserByEmail(props: GetUserByEmailProps): Promise<IUser>;
  setResetPasswordToken(props: SetResetPasswordTokenProps): Promise<number>;
  clearResetPassword(props: ClearResetPasswordProps): Promise<number>;
  updatePassword(props: UpdatePasswordProps): Promise<number>;
  getUserByResetToken(props: GetUserByResetTokenProps): Promise<IUser>;
  getUserByEmailVerificationToken(props: GetUserByEmailVerificationTokenProps): Promise<IUser>;
  deleteMe(props: DeleteMeProps): Promise<number>;
  setUserVerified(props: SetUserVerifiedProps): Promise<number>;
}
