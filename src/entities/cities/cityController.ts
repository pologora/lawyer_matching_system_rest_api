import { HTTP_STATUS_CODES } from '../../config/statusCodes';
import { GetCitiesByRegion } from './types/citiesTypes';

export const getCitiesByRegionController: GetCitiesByRegion =
  ({ City, query }) =>
  async (req, res, _next) => {
    const regionId = Number(req.query.regionId);

    const cities = await City.getCitiesByRegion({ query, regionId });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      data: cities,
      message: 'Cities retrieved successfully',
      status: 'success',
    });
  };
