import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { IUser } from '../../types/user';
import { SetResetPasswordToken, RegisterUser, ForgotPassword, ResetPassword } from './dto';
import { getUserByEmailQuery, loginUserQuery, registerNewUserQuery, setResetPasswordTokenQuery } from './sql';

export class Auth {
  static async login({ email }: { email: string }) {
    const user = await pool.query<RowDataPacket[]>(loginUserQuery, [email]);

    return user[0][0];
  }

  static async register({ email, password }: RegisterUser) {
    const result = await pool.query<ResultSetHeader>(registerNewUserQuery, [email, password]);

    return result[0];
  }

  static async getUserByEmail({ email }: ForgotPassword) {
    const user = await pool.query<RowDataPacket[]>(getUserByEmailQuery, [email]);

    return user[0][0] as IUser;
  }

  static async setResetPasswordToken({ resetToken, expirationInMinutes, userId }: SetResetPasswordToken) {
    const result = await pool.query<ResultSetHeader>(setResetPasswordTokenQuery, [
      resetToken,
      expirationInMinutes,
      userId,
    ]);

    return result[0].affectedRows;
  }

  static async resetPassword({ resetToken }: ResetPassword) {}
}
