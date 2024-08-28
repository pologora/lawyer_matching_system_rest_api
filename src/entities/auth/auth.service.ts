import { createJWT } from '../../utils/jwt/createJWT';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { Auth } from './auth.model';
import {
  ChangeMyPasswordDto,
  DeleteMeDto,
  ForgotPasswordDto,
  GetMeDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
  VerificateEmailDto,
} from './dto';
import { AppError } from '../../core/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { comparePasswords } from '../../utils/passwordManagement/comparePasswords';
import { createRandomToken } from '../../utils/hashedToken/createRandomToken';
import { Request } from 'express';
import { createHashedToken } from '../../utils/hashedToken/createHashedToken';
import { isTokenExpired } from '../../utils/isTokenExpired';
import { ClientProfile } from '../clients/clients.model';
import { LawyersProfile } from '../lawyers/lawyers.model';
import { calculateEmailVerificationExpiraton } from './helpers/calculateEmailVerificationExpirationDate';
import { Email } from '../../core/email/Email';
import { getLawyerByUserIdQuery } from '../lawyers/sqlQueries';
import { getOneClientByUserIdQuery } from '../clients/slqQueries';

export const registerService = async ({ email, password, req }: RegisterUserDto) => {
  const hashedPassword = await hashPassword(password);

  const emailValidationToken = createRandomToken();
  const hashedEmailValidationToken = createHashedToken(emailValidationToken);

  const emailVerificationTokenExpiration = calculateEmailVerificationExpiraton();

  const { insertId } = await Auth.registerByEmail({
    email,
    emailVerificationTokenExpiration,
    hashedEmailValidationToken,
    password: hashedPassword,
  });

  const url = `${req.protocol}://${req.get('host')}/api/v1/auth/email-verification/${emailValidationToken}`;
  await new Email({ url, user: { email } }).sendWellcomeEmailRegistration();

  const token = await createJWT({ id: insertId });

  return token;
};

export const loginService = async ({ email: inputEmail, password: candidatePassword }: LoginUserDto) => {
  // 1) check user with email exists and password is valid
  const user = await Auth.login({ email: inputEmail });

  if (!user || !(await comparePasswords(candidatePassword, user.password))) {
    throw new AppError('Email or password is not valid', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  // 2) create token, return user  + token
  const { userId, email, role } = user;
  const token = await createJWT({ id: userId });

  return { token, user: { email, role, userId } };
};

export const forgotPasswordService = async ({ email }: ForgotPasswordDto, req: Request) => {
  const user = await Auth.getUserByEmail({ email });
  if (!user) {
    throw new AppError('There is no user with this email adress', HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const resetToken = createRandomToken();
  const hashedToken = createHashedToken(resetToken);
  const tokenExpirationInMinutes = Number(process.env.RESET_PASSWORD_EXPIRATION_IN_MINUTES!);

  await Auth.setResetPasswordToken({
    expirationInMinutes: tokenExpirationInMinutes,
    hashedToken,
    userId: user.userId,
  });

  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

  try {
    await new Email({ url: resetPasswordUrl, user }).sendResetPassword();
  } catch (err) {
    await Auth.clearResetPassword({ id: user.userId });
    throw new AppError(
      'There was an error sending the email. Please, try again later',
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500,
    );
  }
};

export const getMeService = async ({ role, userId }: GetMeDto) => {
  return role === 'client'
    ? await ClientProfile.getOneByUserId({ query: getOneClientByUserIdQuery, userId })
    : role === 'lawyer'
    ? await LawyersProfile.getOneByUserId({ getLawyerByUserIdQuery, userId })
    : null;
};
export const resetPasswordService = async ({ resetToken, password }: ResetPasswordDto) => {
  const hashedToken = createHashedToken(resetToken);
  //get user by token
  const user = await Auth.getUserByResetToken({ hashedToken });
  if (!user) {
    throw new AppError('Invalid reset password token', HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  // check if token not expired
  const isResetTokenExpired = isTokenExpired(user.resetPasswordTokenExpiration!);
  if (isResetTokenExpired) {
    throw new AppError('The time limit for changing the password has expired. Please try again');
  }

  //3. update changePasswordAt, and set new pass
  const hashedPassword = await hashPassword(password);
  const result = await Auth.updatePassword({ id: user.userId, password: hashedPassword });
  if (!result) {
    throw new AppError('Password update failed. Please try again later', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }

  //4. send jwt
  return await createJWT({ id: user.userId });
};

export const changeMyPasswordService = async ({ password, newPassword, user }: ChangeMyPasswordDto) => {
  const validPassword = await comparePasswords(password, user.password!);
  if (!validPassword) {
    throw new AppError('Invalid  password', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const hashedPassword = await hashPassword(newPassword);
  const result = await Auth.updatePassword({ id: user.userId, password: hashedPassword });
  if (!result) {
    throw new AppError('Password update failed. Please try again later', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }

  return await createJWT({ id: user.userId });
};

export const deleteMeService = async ({ password, user }: DeleteMeDto) => {
  const validPassword = await comparePasswords(password, user.password!);
  if (!validPassword) {
    throw new AppError('Invalid  password', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const result = await Auth.deleteMe({ id: user.userId });
  if (!result) {
    throw new AppError(
      'Failed to delete an account. Please try again later',
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500,
    );
  }
};

export const verifyEmailService = async ({ token }: VerificateEmailDto) => {
  const hashedToken = createHashedToken(token);

  const user = await Auth.getUserByEmailVerificationToken({ hashedToken });
  if (!user) {
    throw new AppError('Invalid email verification token', HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const isEmailTokenExpired = isTokenExpired(user.emailVerificationTokenExpiration!);
  if (isEmailTokenExpired) {
    throw new AppError(
      'The time limit for email verification expired. Please register again',
      HTTP_STATUS_CODES.BAD_REQUEST_400,
    );
  }

  return await Auth.setUserVerified({ id: user.userId });
};
