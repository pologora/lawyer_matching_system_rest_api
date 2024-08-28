import { NextFunction, Response, Request } from 'express';
import {
  ChangeMyPasswordDto,
  DeleteMeDto,
  ForgotPasswordDto,
  GetMeDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './authServiceTypes';
import { RowDataPacket } from 'mysql2';
import { SetTokenCookieAndSendResponse } from './helpersTypes';

export type RegisterController = (props: {
  setTokenCookieAndSendResponse: SetTokenCookieAndSendResponse;
  registerService: (args: RegisterUserDto) => Promise<string>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type LoginController = (props: {
  setTokenCookieAndSendResponse: SetTokenCookieAndSendResponse;
  loginService: (args: LoginUserDto) => Promise<{
    token: string;
    user: {
      email: string;
      role: string;
      userId: number;
    };
  }>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetMeController = (props: {
  getMeService: (args: GetMeDto) => Promise<RowDataPacket | null>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type LoginWithGoogleCallbackController = (req: Request, res: Response, _next: NextFunction) => Promise<void>;

export type LogoutController = (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type ForgotPasswordController = (props: {
  forgotPasswordService: (args: ForgotPasswordDto) => Promise<void>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type ResetPasswordController = (props: {
  setTokenCookieAndSendResponse: SetTokenCookieAndSendResponse;
  resetPasswordService: (args: ResetPasswordDto) => Promise<string>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type ChangeMyPasswordController = (props: {
  setTokenCookieAndSendResponse: SetTokenCookieAndSendResponse;
  changeMyPasswordService: (args: ChangeMyPasswordDto) => Promise<string>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type DeleteMeController = (props: {
  deleteMeService: (args: DeleteMeDto) => Promise<void>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type VerifyEmailcontroller = (props: {
  verifyEmailService: (args: VerifyEmailDto) => Promise<number>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
