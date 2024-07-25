import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '../../config/db.config';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';
import { getReviewQuery, removeReviewQuery } from './sqlQueries';

type CreateProps = {
  createMessageQuery: string;
  values: string[];
};

type GetOneProps = {
  id: number;
};

type GetManyProps = {
  query: string;
  values: (string | number | Date)[];
};

type UpdateProps = {
  updateMessageQuery: string;
  values: (string | undefined)[];
  id: number;
};

type DeleteProps = {
  id: number;
};

export class Review {
  static async create({ createMessageQuery: createReviewQuery, values }: CreateProps) {
    const [result] = await pool.query<ResultSetHeader>(createReviewQuery, values);

    checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result.insertId;
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getReviewQuery, [id]);

    checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getMany({ query, values }: GetManyProps) {
    const result = await pool.query(query, values);

    return result[0];
  }

  static async update({ updateMessageQuery, values, id }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(updateMessageQuery, [...values, id]);

    checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async remove({ id }: DeleteProps) {
    const [result] = await pool.query<ResultSetHeader>(removeReviewQuery, [id]);

    checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }
}
