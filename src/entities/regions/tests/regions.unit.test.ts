/* eslint-disable sort-keys */
import { Region } from '../regions.model';
import { Pool } from 'mysql2/promise';

describe('Regions route', () => {
  const query = 'Mock database query';

  describe('regionsModel.getAll method', () => {
    const mockQuery = jest.fn();
    const mockRegions = [
      {
        regionId: 2,
        name: 'DOLNOŚLĄSKIE',
      },
      {
        regionId: 4,
        name: 'KUJAWSKO-POMORSKIE',
      },
      {
        regionId: 6,
        name: 'LUBELSKIE',
      },
    ];

    beforeAll(() => {
      jest.clearAllMocks();
      Region.pool = { query: mockQuery } as unknown as Pool;
    });
    it('should return all regions', async () => {
      mockQuery.mockResolvedValue([mockRegions]);

      const result = await Region.getAll({ query });

      expect(mockQuery).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockRegions);
    });
  });
});
