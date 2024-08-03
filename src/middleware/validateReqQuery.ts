import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../utils/statusCodes';

export const validateReqQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      return next(new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400));
    }

    req.body = value;
    next();
  };
};
