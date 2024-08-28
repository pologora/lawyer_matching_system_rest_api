import {
  changeMyPasswordService,
  deleteMeService,
  forgotPasswordService,
  getMeService,
  loginService,
  registerService,
  resetPasswordService,
  verifyEmailService,
} from '../auth.service';
import {
  changeMyPasswordController,
  deleteMeController,
  forgotPasswordController,
  getMeController,
  loginController,
  registerController,
  resetPasswordController,
  verifyEmailcontroller,
} from '../auth.controller';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';
import { AppError } from '../../../core/AppError';
import { Email } from '../../../core/email/Email';
import { createHashedToken } from '../../../utils/hashedToken/createHashedToken';
import { createRandomToken } from '../../../utils/hashedToken/createRandomToken';
import { isTokenExpired } from '../../../utils/isTokenExpired';
import { createJWT } from '../../../utils/jwt/createJWT';
import { comparePasswords } from '../../../utils/passwordManagement/comparePasswords';
import { hashPassword } from '../../../utils/passwordManagement/hashPassword';
import { ClientProfile } from '../../clients/clients.model';
import { getOneClientByUserIdQuery } from '../../clients/slqQueries';
import { LawyersProfile } from '../../lawyers/lawyers.model';
import { getLawyerByUserIdQuery } from '../../lawyers/sqlQueries';
import { Auth } from '../auth.model';
import { calculateEmailVerificationExpiraton } from './calculateEmailVerificationExpirationDate';
import { setTokenCookieAndSendResponse } from './setTokenCookieAndSendResponse';
import {
  clearResetPasswordQuery,
  deleteMeQuery,
  getUserByEmailQuery,
  getUserByEmailVerificationTokenQuery,
  getUserByResetTokenQuery,
  loginUserQuery,
  registerByEmailQuery,
  setResetPasswordTokenQuery,
  setUserVerifiedQuery,
  updateUserPasswordQuery,
} from '../sqlQueries';

const injectedRegisterService = registerService({
  Auth,
  Email,
  calculateEmailVerificationExpiraton,
  createHashedToken,
  createJWT,
  createRandomToken,
  hashPassword,
  registerByEmailQuery,
});

const injectedLoginService = loginService({
  AppError,
  Auth,
  HTTP_STATUS_CODES,
  comparePasswords,
  createJWT,
  loginUserQuery,
});

const injectedGetMeService = getMeService({
  ClientProfile,
  LawyersProfile,
  getLawyerByUserIdQuery,
  getOneClientByUserIdQuery,
});

const injectedVerifyEmailService = verifyEmailService({
  AppError,
  Auth,
  HTTP_STATUS_CODES,
  createHashedToken,
  getUserByEmailVerificationTokenQuery,
  isTokenExpired,
  setUserVerifiedQuery,
});

const injectedForgotPasswordService = forgotPasswordService({
  AppError,
  Auth,
  Email,
  HTTP_STATUS_CODES,
  clearResetPasswordQuery,
  createHashedToken,
  createRandomToken,
  getUserByEmailQuery,
  setResetPasswordTokenQuery,
  tokenExpirationInMinutes: Number(process.env.RESET_PASSWORD_EXPIRATION_IN_MINUTES),
});

const injectedResetPasswordService = resetPasswordService({
  AppError,
  Auth,
  HTTP_STATUS_CODES,
  createHashedToken,
  createJWT,
  getUserByResetTokenQuery,
  hashPassword,
  isTokenExpired,
  updateUserPasswordQuery,
});

const injectedChangeMyPasswordService = changeMyPasswordService({
  AppError,
  Auth,
  HTTP_STATUS_CODES,
  comparePasswords,
  createJWT,
  hashPassword,
  updateUserPasswordQuery,
});

const injectedDeleteMeService = deleteMeService({ AppError, Auth, HTTP_STATUS_CODES, comparePasswords, deleteMeQuery });

export const injectedRegisterController = registerController({
  registerService: injectedRegisterService,
  setTokenCookieAndSendResponse,
});

export const injectedLoginController = loginController({
  loginService: injectedLoginService,
  setTokenCookieAndSendResponse,
});

export const injectedGetMeController = getMeController({ getMeService: injectedGetMeService });

export const injectedVerifyEmailcontroller = verifyEmailcontroller({ verifyEmailService: injectedVerifyEmailService });

export const injectedForgotPasswordController = forgotPasswordController({
  forgotPasswordService: injectedForgotPasswordService,
});

export const injectedResetPasswordController = resetPasswordController({
  resetPasswordService: injectedResetPasswordService,
  setTokenCookieAndSendResponse,
});

export const injectedChangeMyPasswordController = changeMyPasswordController({
  changeMyPasswordService: injectedChangeMyPasswordService,
  setTokenCookieAndSendResponse,
});

export const injectedDeleteMeController = deleteMeController({ deleteMeService: injectedDeleteMeService });
