import {
  changeMyPasswordService,
  deleteMeService,
  forgotPasswordService,
  getMeService,
  loginService,
  registerService,
  resetPasswordService,
  verifyEmailService,
} from '../authService';
import {
  changeMyPasswordController,
  deleteMeController,
  forgotPasswordController,
  getMeController,
  loginController,
  registerController,
  resetPasswordController,
  verifyEmailcontroller,
} from '../authController';
import { Email } from '../../../core/email/Email';
import { createHashedToken } from '../../../utils/hashedToken/createHashedToken';
import { createRandomToken } from '../../../utils/hashedToken/createRandomToken';
import { isTokenExpired } from '../../../utils/isTokenExpired';
import { createJWT } from '../../../utils/jwt/createJWT';
import { comparePasswords } from '../../../utils/passwordManagement/comparePasswords';
import { hashPassword } from '../../../utils/passwordManagement/hashPassword';
import { Client } from '../../clients/Client';
import { getOneClientByUserIdQuery } from '../../clients/slqQueries';
import { Lawyer } from '../../lawyers/Lawyer';
import { getLawyerByUserIdQuery } from '../../lawyers/sqlQueries';
import { Auth } from '../Auth';
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
  Auth,
  comparePasswords,
  createJWT,
  loginUserQuery,
});

const injectedGetMeService = getMeService({
  Client,
  Lawyer,
  getLawyerByUserIdQuery,
  getOneClientByUserIdQuery,
});

const injectedVerifyEmailService = verifyEmailService({
  Auth,
  createHashedToken,
  getUserByEmailVerificationTokenQuery,
  isTokenExpired,
  setUserVerifiedQuery,
});

const injectedForgotPasswordService = forgotPasswordService({
  Auth,
  Email,
  clearResetPasswordQuery,
  createHashedToken,
  createRandomToken,
  getUserByEmailQuery,
  setResetPasswordTokenQuery,
  tokenExpirationInMinutes: Number(process.env.RESET_PASSWORD_EXPIRATION_IN_MINUTES),
});

const injectedResetPasswordService = resetPasswordService({
  Auth,
  createHashedToken,
  createJWT,
  getUserByResetTokenQuery,
  hashPassword,
  isTokenExpired,
  updateUserPasswordQuery,
});

const injectedChangeMyPasswordService = changeMyPasswordService({
  Auth,
  comparePasswords,
  createJWT,
  hashPassword,
  updateUserPasswordQuery,
});

const injectedDeleteMeService = deleteMeService({ Auth, comparePasswords, deleteMeQuery });

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
