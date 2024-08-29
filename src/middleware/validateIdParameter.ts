import { NextFunction, Request, Response } from 'express';
import { idValidationSchema } from '../validation/idValidationSchema';
import { AppError } from '../core/AppError';
import { HTTP_STATUS_CODES } from '../config/statusCodes';

export const validateIdParameter = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const { error } = idValidationSchema.validate({ id });

  if (error) {
    return next(new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400));
  }

  next();
};
