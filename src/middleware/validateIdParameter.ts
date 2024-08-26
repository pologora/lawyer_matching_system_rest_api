import { NextFunction, Request, Response } from 'express';
import { idValidationSchema } from '../validation/idValidationSchema';
import { AppError } from '../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../utils/statusCodes';

export const validateIdParameter = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    next();
  }

  const { error } = idValidationSchema.validate({ id });

  if (error) {
    return next(new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400));
  }

  next();
};
