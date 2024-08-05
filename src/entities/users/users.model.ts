import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { IUser } from '../../types/user';
import {
  createUserQuery,
  deleteUserQuery,
  getUserByIdQuery,
  getUserForAuthQuery,
  updateUserRoleQuery,
} from './sqlQueries';
import { UserRole } from '../../types/userRoles';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';

type CreateProps = {
  email: string;
  hashedPassword: string;
};

type GetOneProps = {
  id: number;
};

type GetOneForAuthProps = {
  id: number;
};

type GetManyProps = {
  values: (string | number | boolean)[];
  query: string;
};

type UpdateProps = {
  query: string;
  values: (string | undefined)[];
  id: number;
};

type RemoveProps = {
  id: number;
};

type SetRoleProps = {
  id: number;
  role: UserRole;
};

class User {
  static async create({ email, hashedPassword }: CreateProps) {
    const [result] = await pool.query<ResultSetHeader>(createUserQuery, [email, hashedPassword]);

    checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result;
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getUserByIdQuery, [id]);

    return result[0] as IUser;
  }

  static async getOneForAuth({ id }: GetOneForAuthProps) {
    const [result] = await pool.query<RowDataPacket[]>(getUserForAuthQuery, [id]);

    return result[0] as IUser;
  }

  static async getMany({ query, values }: GetManyProps) {
    const result = await pool.query(query, values);

    return result[0];
  }

  static async update({ query, values, id }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(query, [...values, id]);

    checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async remove({ id }: RemoveProps) {
    const [result] = await pool.query<ResultSetHeader>(deleteUserQuery, [id]);

    checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }

  static async setRole({ role, id }: SetRoleProps) {
    const [result] = await pool.query<ResultSetHeader>(updateUserRoleQuery, [role, id]);

    checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }
}

export { User };
