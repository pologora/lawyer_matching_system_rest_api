import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import {
  createLawyerSpecializationsQuery,
  deleteLawyerQuery,
  deleteLawyerSpecializationsQuery,
  getAllLawyersQuery,
  getLawyerByIdQuery,
} from './sqlQueries';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';

type CreateLawyerInput = {
  query: string;
  values: string | number[];
  specializations: number[];
};

type UpdateLawyerInput = {
  query: string;
  values: string | number[];
  id: number;
};

type UpdateLawyerSpecializationsInput = {
  lawyerId: number;
  specializationsIds: number[];
};

export class LawyersProfile {
  static async create({ query, values, specializations }: CreateLawyerInput) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.execute<ResultSetHeader>(query, values);

      checkDatabaseOperation({ result: result.affectedRows, operation: 'create' });

      const lawyerId = result.insertId;

      for (const specializationId of specializations) {
        const [data] = await connection.execute<ResultSetHeader>(createLawyerSpecializationsQuery, [
          lawyerId,
          specializationId,
        ]);

        checkDatabaseOperation({ result: data.affectedRows, operation: 'create' });
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
    const [result] = await pool.query<RowDataPacket[]>(getLawyerByIdQuery, [id]);

    checkDatabaseOperation({ result: result[0], id, operation: 'get' });

    return result[0];
  }

  static async getMany() {
    const result = await pool.query(getAllLawyersQuery);

    return result[0];
  }

  static async remove(id: number) {
    const [result] = await pool.query<ResultSetHeader>(deleteLawyerQuery, [id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'remove' });

    return result;
  }

  static async updateLawyerSpecializations({ lawyerId, specializationsIds }: UpdateLawyerSpecializationsInput) {
    const connection = await pool.getConnection();

    try {
      await connection.execute<ResultSetHeader>(deleteLawyerSpecializationsQuery, [lawyerId]);

      for (const specializationId of specializationsIds) {
        const [result] = await connection.execute<ResultSetHeader>(createLawyerSpecializationsQuery, [
          lawyerId,
          specializationId,
        ]);
        checkDatabaseOperation({ result: result.affectedRows, operation: 'create' });
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

  static async update({ id, query, values }: UpdateLawyerInput) {
    if (!values.length) {
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(query, [...values, id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'update' });

    return result;
  }
}
