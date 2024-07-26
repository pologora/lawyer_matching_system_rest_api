import { NextFunction, Request, Response } from 'express';

import { getAllRegionsService } from './regions.service';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';

export const getAllRegionsController = async (_req: Request, res: Response, _next: NextFunction) => {
  const regions = await getAllRegionsService();

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Regions retrieved successfully', data: regions });
};
