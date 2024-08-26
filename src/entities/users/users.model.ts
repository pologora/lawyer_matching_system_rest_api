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
import {
  CreateProps,
  GetManyProps,
  GetOneForAuthProps,
  GetOneProps,
  RemoveProps,
  SetRoleProps,
  UpdateProps,
} from './types/userTypes';
import { BaseModel } from '../../core/model/BaseModel';

class User extends BaseModel {
  static async create({ email, hashedPassword }: CreateProps) {
    const [result] = await pool.query<ResultSetHeader>(createUserQuery, [email, hashedPassword]);

    this.checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result;
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getUserByIdQuery, [id]);

    this.checkDatabaseOperation({ operation: 'get', result: result[0] });

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

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async remove({ id }: RemoveProps) {
    const [result] = await pool.query<ResultSetHeader>(deleteUserQuery, [id]);

    this.checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }

  static async setRole({ role, id }: SetRoleProps) {
    const [result] = await pool.query<ResultSetHeader>(updateUserRoleQuery, [role, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }
}

export { User };
