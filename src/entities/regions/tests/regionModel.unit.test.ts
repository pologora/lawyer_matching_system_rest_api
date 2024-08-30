/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
import { Region } from '../Region';

describe('Region Model', () => {
  const query = 'SELECT * FROM regions';
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
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    Region.pool = { query: mockQuery } as any;
  });

  describe('getAll', () => {
    it('should return all regions', async () => {
      mockQuery.mockResolvedValue([mockRegions]);

      const result = await Region.getAll({ query });

      expect(mockQuery).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockRegions);
    });
  });
});

// export class Region extends BaseModel {
//     static async getAll({ query }: GetAllProps) {
//       const result = await this.pool.query(query);

//       return result[0];
//     }
//   }
