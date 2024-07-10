import { createJWT } from '../../utils/jwt/createJWT';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { Auth } from './auth.model';
import { ForgotPassword, LoginUser, RegisterUser, ResetPassword } from './dto';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { comparePasswords } from '../../utils/passwordManagement/comparePasswords';
import { createPasswordResetToken } from '../../utils/passwordManagement/createPasswordResetToken';
import { RESET_PASSWORD_EXPIRATION_IN_MINUTES } from '../../config/constants';
import { sendEmail } from '../../utils/email/email';
import { Request } from 'express';
import { createPasswordResetHashedToken } from '../../utils/passwordManagement/createHashedPasswordResetToken';

export const registerService = async ({ email, password }: RegisterUser) => {
  const hashedPassword = await hashPassword(password);

  const { insertId } = await Auth.register({ email, password: hashedPassword });

  const token = await createJWT({ id: insertId });

  return token;
};

export const loginService = async ({ email: inputEmail, password: candidatePassword }: LoginUser) => {
  // 1) check user with email exists and password is valid
  const user = await Auth.login({ email: inputEmail });
  if (!user || !(await comparePasswords(candidatePassword, user.password))) {
    throw new AppError('Email or password is not valid', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  // 2) check user role and fetch appropriate data

  // 3) create token, return user info + token
  const { id, email, role } = user;
  const token = await createJWT({ id: user.id });
  const data = { token, user: { id, email, role } };

  return data;
};

export const forgotPasswordService = async ({ email }: ForgotPassword, req: Request) => {
  const user = await Auth.getUserByEmail({ email });
  if (!user) {
    throw new AppError('There is no user with this email adress', HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const resetToken = createPasswordResetToken();
  const hashedToken = createPasswordResetHashedToken(resetToken);

  await Auth.setResetPasswordToken({
    hashedToken,
    expirationInMinutes: RESET_PASSWORD_EXPIRATION_IN_MINUTES,
    userId: user.id,
  });

  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;
  const from = 'Lawyer Matching Service <no-reply@lawyer.com';
  const subject = 'Reset password';
  const text = `To reset your password, please visit this link, valid for ${RESET_PASSWORD_EXPIRATION_IN_MINUTES} minutes: \n${resetPasswordUrl}`;
  const toEmail = user.email;

  try {
    await sendEmail({ from, subject, text, toEmail });
  } catch (err) {
    await Auth.clearResetPassword({ id: user.id });
    // eslint-disable-next-line no-console
    console.error(err);
    throw new AppError(
      'There was an error sending the email. Please, try again later',
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500,
    );
  }
};

export const resetPasswordService = async ({ resetToken, password }: ResetPassword) => {
  const hashedToken = createPasswordResetHashedToken(resetToken);
  //get user by token
  const user = await Auth.getUserByResetToken({ hashedToken });
  if (!user) {
    throw new AppError('Invalid reset password token', HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  // check if token not expired
  const isTokenExpired = checkIfResetTokenExpired(user.reset_password_token_expiration!);
  if (isTokenExpired) {
    throw new AppError('The time limit for changing the password has expired. Please try again.');
  }

  //3. update changePasswordAt, and set new pass
  const result = await Auth.updatePassword({ password, id: user.id });
  if (!result) {
    throw new AppError('Password update failed. Please try again later.', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }

  //4. send jwt
  const jwt = await createJWT({ id: user.id });

  return jwt;
};

function checkIfResetTokenExpired(resetTokenExpire: Date) {
  const now = Date.now();
  const exp = new Date(resetTokenExpire).getTime();

  return now > exp;
}
