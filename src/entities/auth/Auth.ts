import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { IUser } from '../../types/IUser';
import { BaseModel } from '../../core/BaseModel';
import {
  ClearResetPasswordProps,
  DeleteMeProps,
  GetUserByEmailProps,
  GetUserByEmailVerificationTokenProps,
  GetUserByResetTokenProps,
  LoginProps,
  RegisterByEmailProps,
  RegisterByGoogle,
  SetResetPasswordTokenProps,
  SetUserVerifiedProps,
  UpdatePasswordProps,
} from './types/authModelTypes';

export class Auth extends BaseModel {
  static async login({ email, loginUserQuery }: LoginProps) {
    const user = await this.pool.query<RowDataPacket[]>(loginUserQuery, [email]);

    return user[0][0];
  }

  static async registerByEmail({
    email,
    password,
    hashedEmailValidationToken,
    emailVerificationTokenExpiration,
    registerByEmailQuery,
  }: RegisterByEmailProps) {
    const result = await this.pool.query<ResultSetHeader>(registerByEmailQuery, [
      email,
      password,
      hashedEmailValidationToken,
      emailVerificationTokenExpiration,
    ]);

    return result[0];
  }

  static async registerByGoogle({ email, googleId, registerByGoogleQuery }: RegisterByGoogle) {
    const result = await this.pool.query<ResultSetHeader>(registerByGoogleQuery, [email, googleId]);

    return result[0];
  }

  static async getUserByEmail({ email, getUserByEmailQuery }: GetUserByEmailProps) {
    const user = await this.pool.query<RowDataPacket[]>(getUserByEmailQuery, [email]);

    return user[0][0] as IUser;
  }

  static async setResetPasswordToken({
    hashedToken,
    expirationInMinutes,
    userId,
    setResetPasswordTokenQuery,
  }: SetResetPasswordTokenProps) {
    const result = await this.pool.query<ResultSetHeader>(setResetPasswordTokenQuery, [
      hashedToken,
      expirationInMinutes,
      userId,
    ]);

    return result[0].affectedRows;
  }

  static async clearResetPassword({ id, clearResetPasswordQuery }: ClearResetPasswordProps) {
    const result = await this.pool.query<ResultSetHeader>(clearResetPasswordQuery, [id]);

    return result[0].affectedRows;
  }

  static async updatePassword({ password, id, updateUserPasswordQuery }: UpdatePasswordProps) {
    const result = await this.pool.query<ResultSetHeader>(updateUserPasswordQuery, [password, id]);

    return result[0].affectedRows;
  }

  static async getUserByResetToken({ hashedToken, getUserByResetTokenQuery }: GetUserByResetTokenProps) {
    const result = await this.pool.query<RowDataPacket[]>(getUserByResetTokenQuery, [hashedToken]);

    return result[0][0] as IUser;
  }

  static async getUserByEmailVerificationToken({
    hashedToken,
    getUserByEmailVerificationTokenQuery,
  }: GetUserByEmailVerificationTokenProps) {
    const result = await this.pool.query<RowDataPacket[]>(getUserByEmailVerificationTokenQuery, [hashedToken]);

    return result[0][0] as IUser;
  }

  static async deleteMe({ id, deleteMeQuery }: DeleteMeProps) {
    const result = await this.pool.query<ResultSetHeader>(deleteMeQuery, [id]);

    return result[0].affectedRows;
  }

  static async setUserVerified({ id, setUserVerifiedQuery }: SetUserVerifiedProps) {
    const result = await this.pool.query<ResultSetHeader>(setUserVerifiedQuery, [id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result[0] });

    return result[0].affectedRows;
  }
}
