import { RowDataPacket } from 'mysql2';
import {
  ComparePasswords,
  CreateHashedToken,
  CreateRandomToken,
  HashPassword,
  IsTokenExpired,
} from '../../../types/utils';
import { CalculateEmailVerificationExpiraton } from './helpersTypes';
import { Request } from 'express';
import { IUser, UserRole } from '../../../types/IUser';
import { AuthModel } from './authModelTypes';
import { Email } from '../../../core/email/Email';
import { CreateJWT } from '../../../utils/jwt/types/JWTTypes';
import { ClientProfileModel } from '../../clients/types/clientTypes';
import { LawyerProfileModel } from '../../lawyers/types/lawyersTypes';

export type LoginUserDto = {
  email: string;
  password: string;
};

export type RegisterUserDto = {
  req: Request;
};

export type ForgotPasswordDto = {
  req: Request;
};

export type GetMeDto = {
  role: UserRole;
  userId: number;
};

export type ResetPasswordDto = {
  resetToken: string;
  password: string;
  confirmPassword: string;
};

export type ChangeMyPasswordDto = {
  password: string;
  newPassword: string;
  user: IUser;
};

export type DeleteMeDto = {
  password: string;
  user: IUser;
};

export type VerifyEmailDto = {
  token: string;
};

export type RegisterServiceProps = {
  Auth: AuthModel;
  hashPassword: HashPassword;
  createRandomToken: CreateRandomToken;
  createHashedToken: CreateHashedToken;
  calculateEmailVerificationExpiraton: CalculateEmailVerificationExpiraton;
  Email: typeof Email;
  createJWT: (payload: object) => Promise<string>;
  registerByEmailQuery: string;
};

type LoginServiceProps = {
  Auth: AuthModel;
  comparePasswords: ComparePasswords;
  createJWT: CreateJWT;
  loginUserQuery: string;
};

type ForgotPasswordServiceProps = {
  Auth: AuthModel;
  Email: typeof Email;
  createRandomToken: CreateRandomToken;
  createHashedToken: CreateHashedToken;
  tokenExpirationInMinutes: number;
  getUserByEmailQuery: string;
  setResetPasswordTokenQuery: string;
  clearResetPasswordQuery: string;
};

type GetMeServiceProps = {
  ClientProfile: ClientProfileModel;
  LawyerProfile: LawyerProfileModel;
  getOneClientByUserIdQuery: string;
  getLawyerByUserIdQuery: string;
};

type ResetPasswordServiceProps = {
  Auth: AuthModel;
  createHashedToken: CreateHashedToken;
  createJWT: CreateJWT;
  isTokenExpired: IsTokenExpired;
  hashPassword: HashPassword;
  getUserByResetTokenQuery: string;
  updateUserPasswordQuery: string;
};

type ChangeMyPasswordServiceProps = {
  Auth: AuthModel;
  comparePasswords: ComparePasswords;
  hashPassword: HashPassword;
  createJWT: CreateJWT;
  updateUserPasswordQuery: string;
};

type DeleteMeServiceProps = {
  Auth: AuthModel;
  comparePasswords: ComparePasswords;
  deleteMeQuery: string;
};

type VerifyEmailServiceProps = {
  Auth: AuthModel;
  createHashedToken: CreateHashedToken;
  isTokenExpired: IsTokenExpired;
  getUserByEmailVerificationTokenQuery: string;
  setUserVerifiedQuery: string;
};

export type RegisterService = (props: RegisterServiceProps) => (args: RegisterUserDto) => Promise<string>;

export type LoginService = (props: LoginServiceProps) => (args: LoginUserDto) => Promise<{
  token: string;
  user: {
    email: string;
    role: string;
    userId: number;
  };
}>;

export type ForgotPasswordService = (props: ForgotPasswordServiceProps) => (args: ForgotPasswordDto) => Promise<void>;

export type GetMeService = (props: GetMeServiceProps) => (args: GetMeDto) => Promise<RowDataPacket | null>;

export type ResetPasswordService = (props: ResetPasswordServiceProps) => (args: ResetPasswordDto) => Promise<string>;

export type ChangeMyPasswordService = (
  props: ChangeMyPasswordServiceProps,
) => (args: ChangeMyPasswordDto) => Promise<string>;

export type DeleteMeService = (props: DeleteMeServiceProps) => (args: DeleteMeDto) => Promise<void>;

export type VerifyEmailService = (props: VerifyEmailServiceProps) => (args: VerifyEmailDto) => Promise<number>;
