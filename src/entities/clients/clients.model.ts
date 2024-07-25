import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';
import { deleteClientQuery, getManyClientsQuery, getOneClientQuery } from './slqQueries';

export class ClientProfile {
  static async getOne(id: number) {
    const [result] = await pool.query<RowDataPacket[]>(getOneClientQuery, [id]);

    checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }

  static async create(createUserQuery: string, values: string[]) {
    const [result] = await pool.query<ResultSetHeader>(createUserQuery, values);

    checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result.insertId;
  }

  static async getMany() {
    const result = await pool.query(getManyClientsQuery);

    return result[0];
  }

  static async remove(id: number) {
    const [result] = await pool.query<ResultSetHeader>(deleteClientQuery, [id]);

    checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }

  static async update(query: string, values: (string | undefined)[], id: number) {
    const [result] = await pool.query<ResultSetHeader>(query, [...values, id]);

    checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }
}
