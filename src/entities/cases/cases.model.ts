import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '../../config/db.config';
import { deleteCaseQuery, getOneCaseQuery } from './sqlQueries';
import { CreateProps, DeleteProps, GetManyProps, GetOneProps, UpdateProps } from './types/casesTypes';
import { BaseModel } from '../../utils/BaseModel';

export class Case extends BaseModel {
  static async create({ createCaseQuery, values }: CreateProps) {
    const [result] = await pool.query<ResultSetHeader>(createCaseQuery, values);

    this.checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result.insertId;
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getOneCaseQuery, [id]);

    this.checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getMany({ query, values }: GetManyProps) {
    const result = await pool.query(query, values);

    return result[0];
  }

  static async update({ updateCaseQuery, values, id }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(updateCaseQuery, [...values, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async remove({ id }: DeleteProps) {
    const [result] = await pool.query<ResultSetHeader>(deleteCaseQuery, [id]);

    this.checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }
}
