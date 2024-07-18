import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { IUser } from '../../types/user';
import {
  createUserQuery,
  deleteUserQuery,
  getAllUsersQuery,
  getUserByIdQuery,
  updateUserRoleQuery,
} from './sqlQueries';
import { UserRole } from '../../types/userRoles';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';

type CreateUser = {
  email: string;
  hashedPassword: string;
};

class User {
  static async create({ email, hashedPassword }: CreateUser) {
    const [result] = await pool.query<ResultSetHeader>(createUserQuery, [email, hashedPassword]);

    checkDatabaseOperation({ result: result.affectedRows, operation: 'create' });

    return result;
  }

  static async getOne(id: number) {
    const [result] = await pool.query<RowDataPacket[]>(getUserByIdQuery, [id]);

    checkDatabaseOperation({ result: result[0], id, operation: 'get' });

    return result[0] as IUser;
  }

  static async getMany() {
    const result = await pool.query(getAllUsersQuery);

    return result[0];
  }

  static async remove(id: number) {
    const [result] = await pool.query<ResultSetHeader>(deleteUserQuery, [id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'remove' });

    return result;
  }

  static async update(query: string, values: (string | undefined)[], id: number) {
    const [result] = await pool.query<ResultSetHeader>(query, [...values, id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'update' });

    return result;
  }

  static async setRole(role: UserRole, id: number) {
    const [result] = await pool.query<ResultSetHeader>(updateUserRoleQuery, [role, id]);

    checkDatabaseOperation({ result: result.affectedRows, id, operation: 'update' });

    return result;
  }
}

export { User };
