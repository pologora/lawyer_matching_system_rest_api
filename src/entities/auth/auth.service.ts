import { createJWT } from '../../utils/jwt/createJWT';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { Auth } from './auth.model';
import { ForgotPassword, LoginUser, RegisterUser } from './dto';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { comparePasswords } from '../../utils/passwordManagement/comparePasswords';
import { createPasswordResetToken } from '../../utils/passwordManagement/createPasswordResetToken';
import { RESET_PASSWORD_EXPIRATION_IN_MINUTES } from '../../config/constants';

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

export const forgotPasswordService = async ({ email }: ForgotPassword) => {
  const user = await Auth.getUserByEmail({ email });
  if (!user) {
    throw new AppError('There is no user with this email adress', HTTP_STATUS_CODES.NOT_FOUND_404);
  }

  const resetToken = createPasswordResetToken();

  const result = await Auth.setResetPasswordToken({
    resetToken,
    expirationInMinutes: RESET_PASSWORD_EXPIRATION_IN_MINUTES,
    userId: user.id,
  });

  return result;
};
