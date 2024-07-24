import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '../../config/db.config';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';
import { getMessageQuery, removeMessageQuery } from './sqlQueries';

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

export class Message {
  static async create({ createMessageQuery, values }: CreateProps) {
    const [result] = await pool.query<ResultSetHeader>(createMessageQuery, values);

    checkDatabaseOperation({ result: result.affectedRows, operation: 'create' });

    return result.insertId;
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getMessageQuery, [id]);

    checkDatabaseOperation({ operation: 'get', id, result: result[0] });

    return result[0];
  }

  static async getMany({ query, values }: GetManyProps) {
    const result = await pool.query(query, values);

    return result[0];
  }

  static async update({ updateMessageQuery, values, id }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(updateMessageQuery, [...values, id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'update' });

    return result;
  }

  static async remove({ id }: DeleteProps) {
    const [result] = await pool.query<ResultSetHeader>(removeMessageQuery, [id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'remove' });

    return result;
  }
}
