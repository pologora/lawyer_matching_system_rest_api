import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';

export class LawyersProfile {
  static async create() {
    const result = await pool.query<ResultSetHeader>();

    return result[0];
  }

  static async get(id: string) {
    const result = await pool.query<RowDataPacket[]>(getUserByIdQuery, [id]);

    return result[0][0];
  }

  static async getAll() {
    const result = await pool.query(getAllUsersQuery);

    return result[0];
  }

  static async remove(id: string) {
    const result = await pool.query<ResultSetHeader>(deleteUserQuery, [id]);

    return result[0];
  }

  static async update(query: string, values: (string | undefined)[], id: string) {
    const result = await pool.query(query, [...values, id]);

    return result[0];
  }
}
