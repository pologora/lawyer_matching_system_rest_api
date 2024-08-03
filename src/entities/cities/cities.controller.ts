import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { getCitiesByRegionService } from './cities.service';

export const getCitiesByRegionController = async (req: Request, res: Response, _next: NextFunction) => {
  const regionId = Number(req.query.regionId);

  const cities = await getCitiesByRegionService({ regionId });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Cities retrieved successfully', data: cities });
};
