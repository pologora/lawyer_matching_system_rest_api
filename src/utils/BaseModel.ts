import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { CreateProps, DeleteProps, GetManyProps, GetOneProps, UpdateProps } from '../types/BaseModel';
import { CheckDatabaseOperationResult } from '../types/utils';
import { AppError } from './errors/AppError';
import { HTTP_STATUS_CODES } from './statusCodes';
import pool from '../config/db.config';

export class BaseModel {
  protected static checkDatabaseOperation: CheckDatabaseOperationResult = ({ result, id, operation }) => {
    if (!result) {
      const firstElementIndex = 0;
      const capitalizedOperation = operation.charAt(firstElementIndex).toUpperCase() + operation.slice(1);

      if (operation === 'create') {
        throw new AppError(
          `Failed to create database record. Please try again later.`,
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500,
        );
      }

      throw new AppError(
        `Failed to ${capitalizedOperation}. No record found with ID: ${id}`,
        HTTP_STATUS_CODES.NOT_FOUND_404,
      );
    }
  };

  protected static async create({ query, values }: CreateProps) {
    const [result] = await pool.query<ResultSetHeader>(query, values);

    this.checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result.insertId;
  }

  protected static async getOne({ id, query }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(query, [id]);

    this.checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }

  protected static async getMany({ query, values }: GetManyProps) {
    const result = await pool.query(query, values);

    return result[0];
  }

  protected static async update({ query, values, id }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(query, [...values, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  protected static async remove({ id, query }: DeleteProps) {
    const [result] = await pool.query<ResultSetHeader>(query, [id]);

    this.checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }
}
