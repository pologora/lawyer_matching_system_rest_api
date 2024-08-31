/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */

import { Auth } from '../Auth';
jest.mock('../../../core/BaseModel');

describe('Auth Model', () => {
  let mockQuery: jest.Mock;

  beforeEach(() => {
    mockQuery = jest.fn();
    Auth.pool = {
      query: mockQuery,
    } as any;
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a user on successful login', async () => {
      const email = 'test@example.com';
      const loginUserQuery = 'SELECT * FROM users WHERE email = ?';
      const mockUser = { id: 1, email: 'test@example.com' };

      mockQuery.mockResolvedValueOnce([[mockUser]]);

      const user = await Auth.login({ email, loginUserQuery });

      expect(mockQuery).toHaveBeenCalledWith(loginUserQuery, [email]);
      expect(user).toEqual(mockUser);
    });
  });

  describe('registerByEmail', () => {
    it('should register a user by email', async () => {
      const registerByEmailQuery = 'INSERT INTO users ...';
      const result = { insertId: 1, affectedRows: 1, warningStatus: 0 };
      const email = 'test@example.com';
      const password = 'hashedpassword';
      const hashedEmailValidationToken = 'hashedToken';
      const emailVerificationTokenExpiration = new Date();

      mockQuery.mockResolvedValueOnce([result]);

      const dbResult = await Auth.registerByEmail({
        email,
        password,
        hashedEmailValidationToken,
        emailVerificationTokenExpiration,
        registerByEmailQuery,
      });

      expect(mockQuery).toHaveBeenCalledWith(registerByEmailQuery, [
        email,
        password,
        hashedEmailValidationToken,
        emailVerificationTokenExpiration,
      ]);
      expect(dbResult).toEqual(result);
    });
  });

  describe('registerByGoogle', () => {
    it('should register a user by Google', async () => {
      const registerByGoogleQuery = 'INSERT INTO users ...';
      const result = { insertId: 1, affectedRows: 1, warningStatus: 0 };
      const email = 'test@example.com';
      const googleId = 'googleId123';

      mockQuery.mockResolvedValueOnce([result]);

      const dbResult = await Auth.registerByGoogle({ email, googleId, registerByGoogleQuery });

      expect(mockQuery).toHaveBeenCalledWith(registerByGoogleQuery, [email, googleId]);
      expect(dbResult).toEqual(result);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const getUserByEmailQuery = 'SELECT * FROM users WHERE email = ?';
      const mockUser = { userId: 1, email: 'test@example.com' };

      mockQuery.mockResolvedValueOnce([[mockUser]]);

      const user = await Auth.getUserByEmail({ email: 'test@example.com', getUserByEmailQuery });

      expect(mockQuery).toHaveBeenCalledWith(getUserByEmailQuery, ['test@example.com']);
      expect(user).toEqual(mockUser);
    });
  });

  describe('setResetPasswordToken', () => {
    it('should set a reset password token for a user', async () => {
      const setResetPasswordTokenQuery = 'UPDATE users SET ...';
      const result = { affectedRows: 1, insertId: 0, warningStatus: 0 };
      const hashedToken = 'hashedToken';
      const expirationInMinutes = 60;
      const userId = 1;

      mockQuery.mockResolvedValueOnce([result]);

      const affectedRows = await Auth.setResetPasswordToken({
        hashedToken,
        expirationInMinutes,
        userId,
        setResetPasswordTokenQuery,
      });

      expect(mockQuery).toHaveBeenCalledWith(setResetPasswordTokenQuery, [hashedToken, expirationInMinutes, userId]);
      expect(affectedRows).toBe(1);
    });
  });

  describe('clearResetPassword', () => {
    it('should clear the reset password token for a user', async () => {
      const clearResetPasswordQuery = 'UPDATE users SET resetPasswordToken = NULL WHERE id = ?';
      const result = { affectedRows: 1, insertId: 0, warningStatus: 0 };

      mockQuery.mockResolvedValueOnce([result]);

      const affectedRows = await Auth.clearResetPassword({ id: 1, clearResetPasswordQuery });

      expect(mockQuery).toHaveBeenCalledWith(clearResetPasswordQuery, [1]);
      expect(affectedRows).toBe(1);
    });
  });

  describe('updatePassword', () => {
    it('should update the password for a user', async () => {
      const updateUserPasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
      const result = { affectedRows: 1, insertId: 0, warningStatus: 0 };
      const password = 'newHashedPassword';
      const id = 1;

      mockQuery.mockResolvedValueOnce([result]);

      const affectedRows = await Auth.updatePassword({ password, id, updateUserPasswordQuery });

      expect(mockQuery).toHaveBeenCalledWith(updateUserPasswordQuery, [password, id]);
      expect(affectedRows).toBe(1);
    });
  });

  describe('getUserByResetToken', () => {
    it('should return a user by reset token', async () => {
      const getUserByResetTokenQuery = 'SELECT * FROM users WHERE resetPasswordToken = ?';
      const mockUser = { userId: 1, email: 'test@example.com' };

      mockQuery.mockResolvedValueOnce([[mockUser]]);

      const user = await Auth.getUserByResetToken({ hashedToken: 'hashedToken', getUserByResetTokenQuery });

      expect(mockQuery).toHaveBeenCalledWith(getUserByResetTokenQuery, ['hashedToken']);
      expect(user).toEqual(mockUser);
    });
  });

  describe('getUserByEmailVerificationToken', () => {
    it('should return a user by email verification token', async () => {
      const getUserByEmailVerificationTokenQuery = 'SELECT * FROM users WHERE emailVerificationToken = ?';
      const mockUser = { userId: 1, email: 'test@example.com' };

      mockQuery.mockResolvedValueOnce([[mockUser]]);

      const user = await Auth.getUserByEmailVerificationToken({
        hashedToken: 'hashedToken',
        getUserByEmailVerificationTokenQuery,
      });

      expect(mockQuery).toHaveBeenCalledWith(getUserByEmailVerificationTokenQuery, ['hashedToken']);
      expect(user).toEqual(mockUser);
    });
  });

  describe('deleteMe', () => {
    it('should delete the user by ID', async () => {
      const deleteMeQuery = 'DELETE FROM users WHERE id = ?';
      const result = { affectedRows: 1, insertId: 0, warningStatus: 0 };

      mockQuery.mockResolvedValueOnce([result]);

      const affectedRows = await Auth.deleteMe({ id: 1, deleteMeQuery });

      expect(mockQuery).toHaveBeenCalledWith(deleteMeQuery, [1]);
      expect(affectedRows).toBe(1);
    });
  });

  describe('setUserVerified', () => {
    it('should set the user as verified', async () => {
      const setUserVerifiedQuery = 'UPDATE users SET isVerified = true WHERE id = ?';
      const result = { affectedRows: 1, insertId: 0, warningStatus: 0 };

      mockQuery.mockResolvedValueOnce([result]);

      const affectedRows = await Auth.setUserVerified({ id: 1, setUserVerifiedQuery });

      expect(mockQuery).toHaveBeenCalledWith(setUserVerifiedQuery, [1]);
      expect(Auth.checkDatabaseOperation).toHaveBeenCalledWith({
        id: 1,
        operation: 'update',
        result: result,
      });
      expect(affectedRows).toBe(1);
    });
  });
});
