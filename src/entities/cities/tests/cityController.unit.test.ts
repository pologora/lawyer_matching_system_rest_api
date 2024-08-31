/* eslint-disable sort-keys */
import { Request, Response } from 'express';
import { getCitiesByRegionController } from '../cityController';
import { City } from '../City';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';

describe('City controller', () => {
  const req = { query: { regionId: 2 } } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();
  const mockQuery = 'Query';
  const mockCities = [
    { name: 'City1', cityId: 1 },
    { name: 'City2', cityId: 2 },
  ];

  let mockCity: Partial<City>;
  let mockGetCitiesByRegion: jest.Mock;

  beforeEach(() => {
    mockGetCitiesByRegion = jest.fn();
    mockCity = {
      getCitiesByRegion: mockGetCitiesByRegion,
    };
  });

  describe('getCitiesByRegionController', () => {
    it('should return response with a cities fetched data', async () => {
      mockGetCitiesByRegion.mockResolvedValue(mockCities);

      const middleware = getCitiesByRegionController({ City: mockCity as unknown as typeof City, query: mockQuery });
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockCities,
        message: 'Cities retrieved successfully',
        status: 'success',
      });
    });
  });
});
