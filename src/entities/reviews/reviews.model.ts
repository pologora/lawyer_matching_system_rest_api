import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '../../config/db.config';
import { getReviewQuery, removeReviewQuery } from './sqlQueries';
import { BaseModel } from '../../utils/BaseModel';
import { CreateProps, GetManyProps, GetOneProps, UpdateProps } from './types/reviewsTypes';
import { DeleteProps } from '../cases/types/casesTypes';

export class Review extends BaseModel {
  static async create({ createMessageQuery: createReviewQuery, values }: CreateProps) {
    const [result] = await pool.query<ResultSetHeader>(createReviewQuery, values);

    this.checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result.insertId;
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getReviewQuery, [id]);

    this.checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getMany({ query, values }: GetManyProps) {
    const result = await pool.query(query, values);

    return result[0];
  }

  static async update({ updateMessageQuery, values, id }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(updateMessageQuery, [...values, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async remove({ id }: DeleteProps) {
    const [result] = await pool.query<ResultSetHeader>(removeReviewQuery, [id]);

    this.checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }
}
