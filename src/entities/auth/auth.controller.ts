import { NextFunction, Request, Response } from 'express';

import {
  changeMyPasswordService,
  deleteMeService,
  forgotPasswordService,
  getMeService,
  loginService,
  registerService,
  resetPasswordService,
  verifyEmailService,
} from './auth.service';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';

import { setTokenCookieAndSendResponse } from './helpers/setTokenCookieAndSendResponse';
import { cookieOptions } from '../../config/cookieOptions/cookieOptions';
import { IUser } from '../../types/user';
import { resetPasswordSchema } from './auth.validation';

export const registerController = async (req: Request, res: Response, _next: NextFunction) => {
  const token = await registerService({ ...req.body, req });

  setTokenCookieAndSendResponse(res, {
    token,
    message: 'User registered successfully',
    statusCode: HTTP_STATUS_CODES.CREATED_201,
  });
};

export const loginController = async (req: Request, res: Response, _next: NextFunction) => {
  const { token, user } = await loginService(req.body);

  return setTokenCookieAndSendResponse(res, {
    token,
    message: 'User login successfully',
    statusCode: HTTP_STATUS_CODES.SUCCESS_200,
    user,
  });
};

export const getMeController = async (req: Request, res: Response, _next: NextFunction) => {
  const { user } = req;

  const { role, userId, googleId, isVerified, email, createdAt, updatedAt } = user as IUser;

  const profile = await getMeService({ role, userId });

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Retrieved user and profile successfully',
    data: { role, userId, googleId, isVerified, email, createdAt, updatedAt, ...profile },
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
  await forgotPasswordService(req.body, req);

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Reset password link was sent to the user email',
  });
};

export const resetPasswordController = async (req: Request, res: Response, _next: NextFunction) => {
  const { token: resetToken } = req.params;

  const { error, value } = resetPasswordSchema.validate({ resetToken, ...req.body });

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
  const token = await changeMyPasswordService({ ...req.body, user: req.user });

  return setTokenCookieAndSendResponse(res, {
    token,
    message: 'Password has been changed',
    statusCode: HTTP_STATUS_CODES.SUCCESS_200,
  });
};

export const deleteMeController = async (req: Request, res: Response, _next: NextFunction) => {
  await deleteMeService({ ...req.body, user: req.user });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};

export const verifyEmailcontroller = async (req: Request, res: Response, _next: NextFunction) => {
  const { token } = req.params;
  await verifyEmailService({ token });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Email validated successfully',
  });
};
