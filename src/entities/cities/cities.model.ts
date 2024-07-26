import pool from '../../config/db.config';
import { getCitiesByRegionQuery } from './sqlQueries';

type GetManyCitiesProps = {
  regionId: number;
};

export class City {
  static async getCitiesByRegion({ regionId }: GetManyCitiesProps) {
    const result = await pool.query(getCitiesByRegionQuery, [regionId]);

    return result[0];
  }
}
