import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import {
  createLawyerSpecializationsQuery,
  deleteLawyerQuery,
  deleteLawyerSpecializationsQuery,
  getLawyerByIdQuery,
} from './sqlQueries';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';

type CreateProps = {
  query: string;
  values: string | number[];
  specializations: number[];
};

type GetOneProps = {
  id: number;
};

type GetManyProps = {
  query: string;
};

type UpdateProps = {
  query: string;
  values: string | number[];
  id: number;
};

type RemoveProps = {
  id: number;
};

type UpdateLawyerSpecializationsProps = {
  lawyerId: number;
  specializationsIds: number[];
};

export class LawyersProfile {
  static async create({ query, values, specializations }: CreateProps) {
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

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getLawyerByIdQuery, [id]);

    checkDatabaseOperation({ result: result[0], id, operation: 'get' });

    return result[0];
  }

  static async getMany({ query }: GetManyProps) {
    const result = await pool.query(query);

    return result[0];
  }

  static async update({ id, query, values }: UpdateProps) {
    if (!values.length) {
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(query, [...values, id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'update' });

    return result;
  }

  static async remove({ id }: RemoveProps) {
    const [result] = await pool.query<ResultSetHeader>(deleteLawyerQuery, [id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'remove' });

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
}
