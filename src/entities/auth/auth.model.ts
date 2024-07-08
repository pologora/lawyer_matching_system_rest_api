import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { RegisterUser } from './dto/registerUser.dto';
import { loginUserQuery } from './sql/login.sql';
import { registerNewUserQuery } from './sql/register.sql';

export class Auth {
  static async login({ email }: { email: string }) {
    const user = await pool.query<RowDataPacket[]>(loginUserQuery, [email]);

    return user[0][0];
  }

  static async register({ email, password }: RegisterUser) {
    const result = await pool.query<ResultSetHeader>(registerNewUserQuery, [email, password]);

    return result[0];
  }
}
