import pool from '../../config/db.config';
import { getCitiesByRegionQuery } from './sqlQueries';
import { GetManyCitiesProps } from './types/citiesTypes';

export class City {
  static async getCitiesByRegion({ regionId }: GetManyCitiesProps) {
    const result = await pool.query(getCitiesByRegionQuery, [regionId]);

    return result[0];
  }
}
