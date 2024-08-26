import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { GetAllRegionsController } from './types/regionsTypes';

export const getAllRegionsController: GetAllRegionsController =
  ({ Region, query }) =>
  async (_req, res, _next) => {
    const regions = await Region.getAll({ query });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Regions retrieved successfully', data: regions });
  };
