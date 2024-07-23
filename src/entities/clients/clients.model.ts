import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';
import { deleteClientQuery, getManyClientsQuery, getOneClientQuery } from './slqQueries';

export class ClientProfile {
  static async getOne(id: number) {
    const [result] = await pool.query<RowDataPacket[]>(getOneClientQuery, [id]);

    checkDatabaseOperation({ operation: 'get', id, result: result[0] });

    return result[0];
  }

  static async create(createUserQuery: string, values: string[]) {
    const [result] = await pool.query<ResultSetHeader>(createUserQuery, values);

    checkDatabaseOperation({ result: result.affectedRows, operation: 'create' });

    return result.insertId;
  }

  static async getMany() {
    const result = await pool.query(getManyClientsQuery);

    return result[0];
  }

  static async remove(id: number) {
    const [result] = await pool.query<ResultSetHeader>(deleteClientQuery, [id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'remove' });

    return result;
  }

  static async update(query: string, values: (string | undefined)[], id: number) {
    const [result] = await pool.query<ResultSetHeader>(query, [...values, id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'update' });

    return result;
  }
}
