import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { GetCitiesByRegion } from './types/citiesTypes';

export const getCitiesByRegionController: GetCitiesByRegion =
  ({ City, query }) =>
  async (req, res, _next) => {
    const regionId = Number(req.query.regionId);

    const cities = await City.getCitiesByRegion({ regionId, query });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Cities retrieved successfully', data: cities });
  };
