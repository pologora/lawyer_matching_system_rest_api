import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '../../config/db.config';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';
import { deleteCaseQuery, getManyCasesQuery, getOneCaseQuery } from './sqlQueries';

type CreateProps = {
  createCaseQuery: string;
  values: string[];
};

type GetOneProps = {
  id: number;
};

type UpdateProps = {
  updateCaseQuery: string;
  values: (string | undefined)[];
  id: number;
};

type DeleteProps = {
  id: number;
};

export class Case {
  static async create({ createCaseQuery, values }: CreateProps) {
    const [result] = await pool.query<ResultSetHeader>(createCaseQuery, values);

    checkDatabaseOperation({ result: result.affectedRows, operation: 'create' });

    return result.insertId;
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getOneCaseQuery, [id]);

    checkDatabaseOperation({ operation: 'get', id, result: result[0] });

    return result[0];
  }

  static async getMany() {
    const result = await pool.query(getManyCasesQuery);

    return result[0];
  }

  static async update({ updateCaseQuery, values, id }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(updateCaseQuery, [...values, id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'update' });

    return result;
  }

  static async remove({ id }: DeleteProps) {
    const [result] = await pool.query<ResultSetHeader>(deleteCaseQuery, [id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'remove' });

    return result;
  }
}
