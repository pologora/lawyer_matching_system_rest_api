import { NextFunction, Request, Response } from 'express';

import {
  changeMyPasswordService,
  deleteMeService,
  forgotPasswordService,
  getMeService,
  loginService,
  registerService,
  resetPasswordService,
} from './auth.service';
import { userCreateSchema } from '../users/users.validation';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  changeMyPasswordSchema,
  deleteMeSchema,
  forgotPasswordShema,
  resetPasswordSchema,
  userRegistrationSchema,
} from './auth.validation';
import { setTokenCookieAndSendResponse } from './helpers/setTokenCookieAndSendResponse';
import { cookieOptions } from '../../config/cookieOptions/cookieOptions';
import { IUser } from '../../types/user';

export const registerController = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password, confirmPassword } = req.body;
  const { error, value } = userCreateSchema.validate({ email, password, confirmPassword });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const token = await registerService(value);

  setTokenCookieAndSendResponse(res, {
    token,
    message: 'User registered successfully',
    statusCode: HTTP_STATUS_CODES.CREATED_201,
  });
};

export const loginController = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;
  const { error, value } = userRegistrationSchema.validate({ email, password });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const { token, user } = await loginService(value);

  return setTokenCookieAndSendResponse(res, {
    token,
    message: 'User login successfully',
    statusCode: HTTP_STATUS_CODES.SUCCESS_200,
    user,
  });
};

export const getMeController = async (req: Request, res: Response, _next: NextFunction) => {
  const { user } = req;

  const { role, userId } = user as IUser;

  const profile = await getMeService({ role, userId });

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Retrieved user and profile successfully',
    data: { user, profile },
  });
};

export const loginWithGoogleCallbackController = async (req: Request, res: Response, _next: NextFunction) => {
  const { user } = req;
  const { token } = user as IUser;

  res.cookie('jwt', token, cookieOptions);

  return res.redirect(process.env.FRONTEND_URL!);
};

export const logoutController = async (req: Request, res: Response, _next: NextFunction) => {
  res.clearCookie('jwt', cookieOptions);

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User log out successfully',
  });
};

export const forgotPasswordController = async (req: Request, res: Response, _next: NextFunction) => {
  const { email } = req.body;
  const { error, value } = forgotPasswordShema.validate({ email });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  await forgotPasswordService(value, req);

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Reset password link was sent to the user email',
  });
};

export const resetPasswordController = async (req: Request, res: Response, _next: NextFunction) => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  const { error, value } = resetPasswordSchema.validate({ resetToken, password, confirmPassword });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const token = await resetPasswordService(value);

  return setTokenCookieAndSendResponse(res, {
    token,
    message: 'Password has been changed',
    statusCode: HTTP_STATUS_CODES.SUCCESS_200,
  });
};

export const changeMyPasswordController = async (req: Request, res: Response, _next: NextFunction) => {
  const { password, newPassword, confirmNewPassword } = req.body;
  const { error, value } = changeMyPasswordSchema.validate({ password, newPassword, confirmNewPassword });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const token = await changeMyPasswordService({ ...value, user: req.user! });

  return setTokenCookieAndSendResponse(res, {
    token,
    message: 'Password has been changed',
    statusCode: HTTP_STATUS_CODES.SUCCESS_200,
  });
};

export const deleteMeController = async (req: Request, res: Response, _next: NextFunction) => {
  const { password } = req.body;

  const { error, value } = deleteMeSchema.validate({ password });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  await deleteMeService({ ...value, user: req.user });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
