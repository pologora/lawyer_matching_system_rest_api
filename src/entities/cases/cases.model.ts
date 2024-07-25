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

    checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result.insertId;
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getOneCaseQuery, [id]);

    checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getMany() {
    const result = await pool.query(getManyCasesQuery);

    return result[0];
  }

  static async update({ updateCaseQuery, values, id }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(updateCaseQuery, [...values, id]);

    checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async remove({ id }: DeleteProps) {
    const [result] = await pool.query<ResultSetHeader>(deleteCaseQuery, [id]);

    checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }
}
