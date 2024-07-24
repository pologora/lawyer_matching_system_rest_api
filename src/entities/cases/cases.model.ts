import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '../../config/db.config';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';
import { deleteCaseQuery, getManyCasesQuery, getOneCaseQuery } from './sqlQueries';

type UpdateCaseParams = {
  updateCaseQuery: string;
  values: (string | undefined)[];
  id: number;
};

type GetOneCaseParams = {
  id: number;
};

type DeleteCaseParams = {
  id: number;
};

type CreateCaseParams = {
  createCaseQuery: string;
  values: string[];
};

export class Case {
  static async create({ createCaseQuery, values }: CreateCaseParams) {
    const [result] = await pool.query<ResultSetHeader>(createCaseQuery, values);

    checkDatabaseOperation({ result: result.affectedRows, operation: 'create' });

    return result.insertId;
  }

  static async getOne({ id }: GetOneCaseParams) {
    const [result] = await pool.query<RowDataPacket[]>(getOneCaseQuery, [id]);

    checkDatabaseOperation({ operation: 'get', id, result: result[0] });

    return result[0];
  }

  static async getMany() {
    const result = await pool.query(getManyCasesQuery);

    return result[0];
  }

  static async update({ updateCaseQuery, values, id }: UpdateCaseParams) {
    const [result] = await pool.query<ResultSetHeader>(updateCaseQuery, [...values, id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'update' });

    return result;
  }

  static async remove({ id }: DeleteCaseParams) {
    const [result] = await pool.query<ResultSetHeader>(deleteCaseQuery, [id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'remove' });

    return result;
  }
}
