import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { IUser } from '../../types/user';
import {
  clearResetPasswordQuery,
  deleteMeQuery,
  getUserByEmailQuery,
  getUserByEmailVerificationTokenQuery,
  getUserByResetTokenQuery,
  loginUserQuery,
  registerByEmailQuery,
  registerByGoogleQuery,
  setResetPasswordTokenQuery,
  updateUserPasswordQuery,
} from './sqlQueries';

type LoginProps = {
  email: string;
};

type RegisterByEmailProps = {
  email: string;
  password: string;
  emailVerificationTokenExpiration: Date;
  hashedEmailValidationToken: string;
};

type RegisterByGoogle = {
  email: string;
  googleId: string;
};

type GetUserByEmailProps = {
  email: string;
};

type SetResetPasswordTokenProps = {
  hashedToken: string;
  expirationInMinutes: number;
  userId: number;
};

type ClearResetPasswordProps = {
  id: number;
};

type UpdatePasswordProps = {
  password: string;
  id: number;
};

type GetUserByResetTokenProps = {
  hashedToken: string;
};

type GetUserByEmailVerificationTokenProps = {
  hashedToken: string;
};

type DeleteMeProps = {
  id: number;
};

export class Auth {
  static async login({ email }: LoginProps) {
    const user = await pool.query<RowDataPacket[]>(loginUserQuery, [email]);

    return user[0][0];
  }

  static async registerByEmail({
    email,
    password,
    hashedEmailValidationToken,
    emailVerificationTokenExpiration,
  }: RegisterByEmailProps) {
    const result = await pool.query<ResultSetHeader>(registerByEmailQuery, [
      email,
      password,
      hashedEmailValidationToken,
      emailVerificationTokenExpiration,
    ]);

    return result[0];
  }

  static async registerByGoogle({ email, googleId }: RegisterByGoogle) {
    const result = await pool.query<ResultSetHeader>(registerByGoogleQuery, [email, googleId]);

    return result[0];
  }

  static async getUserByEmail({ email }: GetUserByEmailProps) {
    const user = await pool.query<RowDataPacket[]>(getUserByEmailQuery, [email]);

    return user[0][0] as IUser;
  }

  static async setResetPasswordToken({ hashedToken, expirationInMinutes, userId }: SetResetPasswordTokenProps) {
    const result = await pool.query<ResultSetHeader>(setResetPasswordTokenQuery, [
      hashedToken,
      expirationInMinutes,
      userId,
    ]);

    return result[0].affectedRows;
  }

  static async clearResetPassword({ id }: ClearResetPasswordProps) {
    const result = await pool.query<ResultSetHeader>(clearResetPasswordQuery, [id]);

    return result[0].affectedRows;
  }

  static async updatePassword({ password, id }: UpdatePasswordProps) {
    const result = await pool.query<ResultSetHeader>(updateUserPasswordQuery, [password, id]);

    return result[0].affectedRows;
  }

  static async getUserByResetToken({ hashedToken }: GetUserByResetTokenProps) {
    const result = await pool.query<RowDataPacket[]>(getUserByResetTokenQuery, [hashedToken]);

    return result[0][0] as IUser;
  }

  static async getUserByEmailVerificationToken({ hashedToken }: GetUserByEmailVerificationTokenProps) {
    const result = await pool.query<RowDataPacket[]>(getUserByEmailVerificationTokenQuery, [hashedToken]);

    return result[0][0] as IUser;
  }

  static async deleteMe({ id }: DeleteMeProps) {
    const result = await pool.query<ResultSetHeader>(deleteMeQuery, [id]);

    return result[0].affectedRows;
  }
}
