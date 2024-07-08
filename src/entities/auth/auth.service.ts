import { createJWT } from '../../utils/jwt/createJWT';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { CreateUser } from '../users/dto/createUser.dto';
import { Auth } from './auth.model';
import { LoginUser } from './dto/loginUser.dto';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { comparePasswords } from '../../utils/passwordManagement/comparePasswords';

export const registerService = async ({ email, password }: CreateUser) => {
  const hashedPassword = await hashPassword(password);

  const { insertId } = await Auth.register({ email, password: hashedPassword });

  const token = createJWT({ id: insertId });

  return token;
};

export const loginService = async ({ email: inputEmail, password: candidatePassword }: LoginUser) => {
  // check user with email exists and password is valid
  const user = await Auth.login({ email: inputEmail });
  if (!user || !(await comparePasswords(candidatePassword, user.password))) {
    throw new AppError('Email or password is not valid', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  // check user role and fetch appropriate data
  // profile
  // create token, return user info + token
  const { id, email, role } = user;
  const token = createJWT({ id: user.id });
  const data = { token, user: { id, email, role } };

  return data;
};
