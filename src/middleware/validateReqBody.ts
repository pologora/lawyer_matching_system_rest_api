import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../core/AppError';
import { HTTP_STATUS_CODES } from '../config/statusCodes';

export const validateReqBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400));
    }

    req.body = value;
    next();
  };
};
