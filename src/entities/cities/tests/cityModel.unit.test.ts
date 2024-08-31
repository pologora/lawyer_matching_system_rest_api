/* eslint-disable sort-keys */
import { City } from '../City';

describe('City model', () => {
  let mockQuery: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockQuery = jest.fn();
  });

  const mockCitiesData = [
    { name: 'City1', cityId: 1 },
    { name: 'City2', cityId: 2 },
  ];
  describe('getCitiesByRegion', () => {
    it('should return cities list', async () => {
      City.pool.query = mockQuery;
      const query = 'Query';
      const regionId = 2;

      mockQuery.mockResolvedValue([mockCitiesData]);

      const result = await City.getCitiesByRegion({ regionId, query });

      expect(result).toEqual(mockCitiesData);
    });
  });
});
