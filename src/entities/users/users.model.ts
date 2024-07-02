import pool from '../../config/db.config';
import { CreateUser } from './dto/createUser.dto';
import { UpdateUser } from './dto/updateUser.dto';
import { createUserQuery } from './sql/createUser.sql';
import { deleteUserQuery } from './sql/deleteUser.sql';
import { getAllUsersQuery } from './sql/getAllUsers.sql';
import { getUserByIdQuery } from './sql/getUserById.sql';

class User {
  static async create({ name, email, password }: CreateUser) {
    const result = await pool.query(createUserQuery, [name, email, password]);
    console.log(result);

    return result;
  }

  static async getUser(id: number) {
    const result = await pool.query(getUserByIdQuery, [id]);
    console.log(result);

    return result;
  }

  static async getAllUsers() {
    const result = await pool.query(getAllUsersQuery);
    console.log(result);

    return result;
  }

  static async deleteUserQuery(id: number) {
    const result = await pool.query(deleteUserQuery, [id]);
    console.log(result);

    return result;
  }

  static async updateUser(data: UpdateUser, id: number) {}
}

export { User };
