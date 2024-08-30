/* eslint-disable sort-keys */
import { NextFunction, Request, Response } from 'express';

import { Region } from '../Region';
import { getAllRegionsController } from '../regionController';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';

const mockRegions = [
  {
    regionId: 2,
    name: 'DOLNOŚLĄSKIE',
  },
  {
    regionId: 4,
    name: 'KUJAWSKO-POMORSKIE',
  },
];

describe('region controller', () => {
  const query = 'Mock database query';
  const req = {} as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;
  describe('getAllRegionsController', () => {
    const mockQuery = jest.fn();

    beforeAll(() => {
      jest.clearAllMocks();
      Region.getAll = mockQuery;
    });

    it('should return response with all regions', async () => {
      mockQuery.mockResolvedValue(mockRegions);

      const middleware = getAllRegionsController({ Region, query });
      await middleware(req, res, next);

      expect(middleware).toBeInstanceOf(Function);
      expect(mockQuery).toHaveBeenCalledWith({ query });
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        data: mockRegions,
        message: 'Regions retrieved successfully',
        status: 'success',
      });
    });
  });
});
