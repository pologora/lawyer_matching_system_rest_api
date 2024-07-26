import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { getCitiesByRegionService } from './cities.service';
import { getCitiesByRegionSchema } from './cities.validation';
import { AppError } from '../../utils/errors/AppError';

export const getCitiesByRegionController = async (req: Request, res: Response, _next: NextFunction) => {
  const { query } = req;

  const { error, value } = getCitiesByRegionSchema.validate(query);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const cities = await getCitiesByRegionService(value);

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Cities retrieved successfully', data: cities });
};
