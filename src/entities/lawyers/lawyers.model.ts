import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { deleteLawyerQuery, getAllLawyersQuery, getLawyerByIdQuery } from './sqlQueries';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';

type CreateLawyerInput = {
  query: string;
  values: string | number[];
  specializations: number[];
};

export class LawyersProfile {
  static async create({ query, values, specializations }: CreateLawyerInput) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const [result] = await connection.execute<ResultSetHeader>(query, values);

      const lawyerId = result.insertId;
      if (!lawyerId) {
        throw new AppError('Failed to insert lawyer profile', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
      }

      for (const specializationId of specializations) {
        await connection.execute(
          `INSERT INTO lawyer_specializations (lawyer_id, specialization_id)
           VALUES (?, ?)`,
          [lawyerId, specializationId],
        );
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

  static async getOne(id: number) {
    const result = await pool.query<RowDataPacket[]>(getLawyerByIdQuery, [id]);

    return result[0][0];
  }

  static async getMany() {
    const result = await pool.query(getAllLawyersQuery);

    return result[0];
  }

  static async remove(id: number) {
    const result = await pool.query<ResultSetHeader>(deleteLawyerQuery, [id]);

    return result[0];
  }

  static async update(query: string, values: (string | undefined)[], id: string) {
    const result = await pool.query(query, [...values, id]);

    return result[0];
  }
}
