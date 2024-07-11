import { NextFunction, Request, Response } from 'express';
import {
  changeMyPasswordService,
  forgotPasswordService,
  loginService,
  registerService,
  resetPasswordService,
} from './auth.service';
import { userCreateSchema } from '../users/users.validation';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  changeMyPasswordSchema,
  forgotPasswordShema,
  resetPasswordSchema,
  userRegistrationSchema,
} from './auth.validation';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, confirmPassword } = req.body;
  const { error, value } = userCreateSchema.validate({ email, password, confirmPassword });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const token = await registerService(value);

  res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'User registered successfully',
    token,
  });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { error, value } = userRegistrationSchema.validate({ email, password });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const data = await loginService(value);

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User login successfully',
    data,
  });
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const { error, value } = forgotPasswordShema.validate({ email });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  await forgotPasswordService(value, req);

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Reset password link was sent to the user email',
  });
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  const { error, value } = resetPasswordSchema.validate({ resetToken, password, confirmPassword });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const jwt = await resetPasswordService(value);

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Password has been changed',
    token: jwt,
  });
};

export const changeMyPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, newPassword, confirmNewPassword } = req.body;
  const { error, value } = changeMyPasswordSchema.validate({ password, newPassword, confirmNewPassword });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const token = await changeMyPasswordService({ ...value, user: req.user! });

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Password was changed',
    token,
  });
};
