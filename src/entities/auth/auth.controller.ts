import { NextFunction, Request, Response } from 'express';
import { loginService, registerService } from './auth.service';
import { userCreateSchema } from '../users/users.validation';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { userRegistrationSchema } from './auth.validation';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, confirmPassword } = req.body;
  const { error, value } = userCreateSchema.validate({ email, password, confirmPassword });

  if (error) {
    throw new AppError(error.message);
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
    throw new AppError(error.message);
  }

  const data = await loginService(value);

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User login successfully',
    data,
  });
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {};
