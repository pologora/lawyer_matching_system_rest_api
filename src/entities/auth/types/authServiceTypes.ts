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
import { AppError } from '../../../core/AppError';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';
import { ClientProfileModel } from '../../clients/types/clientTypes';
import { LawyersProfileModel } from '../../lawyers/types/lawyersTypes';

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
  AppError: typeof AppError;
  loginUserQuery: string;
  HTTP_STATUS_CODES: typeof HTTP_STATUS_CODES;
};

type ForgotPasswordServiceProps = {
  Auth: AuthModel;
  AppError: typeof AppError;
  Email: typeof Email;
  createRandomToken: CreateRandomToken;
  createHashedToken: CreateHashedToken;
  tokenExpirationInMinutes: number;
  HTTP_STATUS_CODES: typeof HTTP_STATUS_CODES;
  getUserByEmailQuery: string;
  setResetPasswordTokenQuery: string;
  clearResetPasswordQuery: string;
};

type GetMeServiceProps = {
  ClientProfile: ClientProfileModel;
  LawyersProfile: LawyersProfileModel;
  getOneClientByUserIdQuery: string;
  getLawyerByUserIdQuery: string;
};

type ResetPasswordServiceProps = {
  Auth: AuthModel;
  createHashedToken: CreateHashedToken;
  createJWT: CreateJWT;
  isTokenExpired: IsTokenExpired;
  hashPassword: HashPassword;
  AppError: typeof AppError;
  HTTP_STATUS_CODES: typeof HTTP_STATUS_CODES;
  getUserByResetTokenQuery: string;
  updateUserPasswordQuery: string;
};

type ChangeMyPasswordServiceProps = {
  Auth: AuthModel;
  AppError: typeof AppError;
  comparePasswords: ComparePasswords;
  hashPassword: HashPassword;
  createJWT: CreateJWT;
  HTTP_STATUS_CODES: typeof HTTP_STATUS_CODES;
  updateUserPasswordQuery: string;
};

type DeleteMeServiceProps = {
  Auth: AuthModel;
  comparePasswords: ComparePasswords;
  HTTP_STATUS_CODES: typeof HTTP_STATUS_CODES;
  AppError: typeof AppError;
  deleteMeQuery: string;
};

type VerifyEmailServiceProps = {
  Auth: AuthModel;
  AppError: typeof AppError;
  createHashedToken: CreateHashedToken;
  isTokenExpired: IsTokenExpired;
  HTTP_STATUS_CODES: typeof HTTP_STATUS_CODES;
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
