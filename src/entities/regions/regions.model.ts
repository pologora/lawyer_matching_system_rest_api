import pool from '../../config/db.config';
import { getAllRegionsQuery } from './sqlQueries';

export class Region {
  static async getAll() {
    const result = await pool.query(getAllRegionsQuery);

    return result[0];
  }
}
