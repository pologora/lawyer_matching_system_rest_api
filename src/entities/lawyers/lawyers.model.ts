import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import {
  createLawyerSpecializationsQuery,
  deleteLawyerQuery,
  deleteLawyerSpecializationsQuery,
  getLawyerByIdQuery,
  getLawyerByUserIdQuery,
  updateRatingQuery,
} from './sqlQueries';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  CreateProps,
  GetManyProps,
  GetOneByUserIdProps,
  GetOneProps,
  RemoveProps,
  UpdateLawyerSpecializationsProps,
  UpdateProps,
  UpdateRatingProps,
} from './types/lawyersTypes';
import { BaseModel } from '../../utils/BaseModel';

export class LawyersProfile extends BaseModel {
  static async create({ query, values, specializations }: CreateProps) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.execute<ResultSetHeader>(query, values);

      this.checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

      const lawyerId = result.insertId;

      for (const specializationId of specializations) {
        const [data] = await connection.execute<ResultSetHeader>(createLawyerSpecializationsQuery, [
          lawyerId,
          specializationId,
        ]);

        this.checkDatabaseOperation({ operation: 'create', result: data.affectedRows });
      }

      await connection.commit();

      return lawyerId;
    } catch (error) {
      await connection.rollback();
      if (error instanceof Error) {
        throw new AppError(error.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
      }
    } finally {
      connection.release();
    }
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getLawyerByIdQuery, [id]);

    this.checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getOneByUserId({ userId }: GetOneByUserIdProps) {
    const [result] = await pool.query<RowDataPacket[]>(getLawyerByUserIdQuery, [userId]);

    this.checkDatabaseOperation({ id: userId, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getMany({ query, values }: GetManyProps) {
    const result = await pool.query(query, values);

    return result[0];
  }

  static async update({ id, query, values }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(query, [...values, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async updateRating({ id }: UpdateRatingProps) {
    const [result] = await pool.query<ResultSetHeader>(updateRatingQuery, [id, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async remove({ id }: RemoveProps) {
    const [result] = await pool.query<ResultSetHeader>(deleteLawyerQuery, [id]);

    this.checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }

  static async updateLawyerSpecializations({ lawyerId, specializationsIds }: UpdateLawyerSpecializationsProps) {
    const connection = await pool.getConnection();

    try {
      await connection.execute<ResultSetHeader>(deleteLawyerSpecializationsQuery, [lawyerId]);

      for (const specializationId of specializationsIds) {
        const [result] = await connection.execute<ResultSetHeader>(createLawyerSpecializationsQuery, [
          lawyerId,
          specializationId,
        ]);
        this.checkDatabaseOperation({ operation: 'create', result: result.affectedRows });
      }

      connection.commit();
      await connection.beginTransaction();
    } catch (error) {
      await connection.rollback();
      if (error instanceof Error) {
        throw new AppError(error.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
      }
    } finally {
      connection.release();
    }
  }
}
