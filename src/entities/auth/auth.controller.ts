import { NextFunction, Request, Response } from 'express';
import { registerService } from './auth.service';
import { userCreateSchema } from '../users/users.validation';
import { AppError } from '../../utils/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, confirmPassword } = req.body;
  const { error, value } = userCreateSchema.validate({ email, password, confirmPassword });

  if (error) {
    throw new AppError(error.message);
  }

  const token = await registerService(value);

  res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'User registerd successfully',
    token,
  });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {};
