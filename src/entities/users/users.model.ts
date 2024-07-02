import pool from '../../config/db.config';
import { createUserQuery } from './sql/createUser.sql';
import { deleteUserQuery } from './sql/deleteUser.sql';
import { getAllUsersQuery } from './sql/getAllUsers.sql';
import { getUserByIdQuery } from './sql/getUserById.sql';

type CreateUser = {
  name: string;
  email: string;
  password: string;
};

class User {
  static async createUser({ name, email, password }: CreateUser) {
    const result = await pool.query(createUserQuery, [name, email, password]);

    return result;
  }

  static async getUser(id: number) {
    const result = await pool.query(getUserByIdQuery, [id]);

    return result[0];
  }

  static async getAllUsers() {
    const result = await pool.query(getAllUsersQuery);

    return result[0];
  }

  static async deleteUserQuery(id: number) {
    const result = await pool.query(deleteUserQuery, [id]);

    return result;
  }

  static async updateUser(query: string, values: (string | undefined)[], id: number) {
    const result = await pool.query(query, [...values, id]);

    return result;
  }
}

export { User };
