import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { AppError } from '../../core/AppError';
import { HTTP_STATUS_CODES } from '../../config/statusCodes';
import {
  CreateLawyerProps,
  GetOneByUserIdProps,
  UpdateLawyerSpecializationsProps,
  UpdateRatingProps,
} from './types/lawyersTypes';
import { CRUDModel } from '../../core/CRUDModel';

export class Lawyer extends CRUDModel {
  static async create({ query, values, specializations, createLawyerSpecializationsQuery }: CreateLawyerProps) {
    const connection = await this.pool.getConnection();

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

      throw new AppError('An unexpected error occurred', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    } finally {
      connection.release();
    }
  }

  static async getOneByUserId({ userId, getLawyerByUserIdQuery }: GetOneByUserIdProps) {
    const [result] = await this.pool.query<RowDataPacket[]>(getLawyerByUserIdQuery, [userId]);

    this.checkDatabaseOperation({ id: userId, operation: 'get', result: result[0] });

    return result[0];
  }

  static async updateRating({ id, updateRatingQuery }: UpdateRatingProps) {
    const [result] = await this.pool.query<ResultSetHeader>(updateRatingQuery, [id, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async updateLawyerSpecializations({
    lawyerId,
    specializationsIds,
    deleteLawyerSpecializationsQuery,
    createLawyerSpecializationsQuery,
  }: UpdateLawyerSpecializationsProps) {
    const connection = await this.pool.getConnection();

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

      throw new AppError('An unexpected error occurred', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    } finally {
      connection.release();
    }
  }
}
