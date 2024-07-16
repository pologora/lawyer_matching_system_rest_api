import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { IUser } from '../../types/user';
import { createUserQuery, deleteUserQuery, getAllUsersQuery, getUserByIdQuery } from './sqlQueries';

type CreateUser = {
  email: string;
  hashedPassword: string;
};

class User {
  static async create({ email, hashedPassword }: CreateUser) {
    const result = await pool.query<ResultSetHeader>(createUserQuery, [email, hashedPassword]);

    return result[0];
  }

  static async getOne(id: string) {
    const result = await pool.query<RowDataPacket[]>(getUserByIdQuery, [id]);

    return result[0][0] as IUser;
  }

  static async getMany() {
    const result = await pool.query(getAllUsersQuery);

    return result[0];
  }

  static async remove(id: string) {
    const result = await pool.query<ResultSetHeader>(deleteUserQuery, [id]);

    return result[0];
  }

  static async update(query: string, values: (string | undefined)[], id: string) {
    const result = await pool.query(query, [...values, id]);

    return result[0];
  }
}

export { User };
