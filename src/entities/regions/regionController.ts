import { HTTP_STATUS_CODES } from '../../config/statusCodes';
import { GetAllRegionsController } from './types/regionsTypes';

export const getAllRegionsController: GetAllRegionsController =
  ({ Region, query }) =>
  async (_req, res, _next) => {
    const regions = await Region.getAll({ query });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      data: regions,
      message: 'Regions retrieved successfully',
      status: 'success',
    });
  };
