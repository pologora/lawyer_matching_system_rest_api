import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { IUser } from '../../types/user';
import { SetResetPasswordToken } from './dto';
import {
  clearResetPasswordQuery,
  getUserByEmailQuery,
  getUserByResetTokenQuery,
  loginUserQuery,
  registerNewUserQuery,
  setResetPasswordTokenQuery,
  updateUserPasswordQuery,
} from './sql';

export class Auth {
  static async login({ email }: { email: string }) {
    const user = await pool.query<RowDataPacket[]>(loginUserQuery, [email]);

    return user[0][0];
  }

  static async register({ email, password }: { email: string; password: string }) {
    const result = await pool.query<ResultSetHeader>(registerNewUserQuery, [email, password]);

    return result[0];
  }

  static async getUserByEmail({ email }: { email: string }) {
    const user = await pool.query<RowDataPacket[]>(getUserByEmailQuery, [email]);

    return user[0][0] as IUser;
  }

  static async setResetPasswordToken({ hashedToken, expirationInMinutes, userId }: SetResetPasswordToken) {
    const result = await pool.query<ResultSetHeader>(setResetPasswordTokenQuery, [
      hashedToken,
      expirationInMinutes,
      userId,
    ]);

    return result[0].affectedRows;
  }

  static async clearResetPassword({ id }: { id: number }) {
    const result = await pool.query<ResultSetHeader>(clearResetPasswordQuery, [id]);

    return result[0].affectedRows;
  }

  static async updatePassword({ password, id }: { password: string; id: number }) {
    const result = await pool.query<ResultSetHeader>(updateUserPasswordQuery, [password, id]);

    return result[0].affectedRows;
  }

  static async getUserByResetToken({ hashedToken }: { hashedToken: string }) {
    const result = await pool.query<RowDataPacket[]>(getUserByResetTokenQuery, [hashedToken]);

    return result[0][0] as IUser;
  }
}
