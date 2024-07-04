import { RowDataPacket } from 'mysql2';
import pool from '../config/db.config';
import { AppError } from '../utils/AppError';
import { asyncErrorCatch } from '../utils/asyncErrorCatchHandler';
import { HTTP_STATUS_CODES } from '../utils/statusCodes';

/**
 * @param tableName - SQL database table name
 * @returns void or throw
 */
export const verifyAndValidateRecordById = (tableName: string) =>
  asyncErrorCatch(async (req, _res, next) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new AppError(`Bad user id type, should be a number.`);
    }

    const query = `SELECT id 
    FROM ${tableName} 
    WHERE id = ?;
`;

    const [result] = await pool.query<RowDataPacket[]>(query, [Number(id)]);

    if (!result[0]) {
      throw new AppError(`No user found with id: ${id}`, HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    next();
  });
