/* eslint-disable sort-keys */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */

import { NextFunction, Request, Response } from 'express';
import { HashPassword } from '../../../types/utils';
import { UserController } from '../UserController';
import { buildInsertQuery } from '../../../utils/buildInsertQuery';
import { User } from '../User';
import { AppError } from '../../../core/AppError';
import { buildUpdateQuery } from '../../../utils/buildUpdateQuery';

jest.mock('../User');
jest.mock('../../../utils/buildInsertQuery');
jest.mock('../../../utils/buildUpdateQuery');

describe('UserController', () => {
  let hashPasswordMock: jest.MockedFunction<HashPassword>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let userController: UserController;

  beforeEach(() => {
    hashPasswordMock = jest.fn();

    req = {
      body: { email: 'test@example.com', password: 'password123' },
      params: { id: '1' },
      file: { filename: 'profile.jpg' },
    } as unknown as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    userController = new UserController({ hashPassword: hashPasswordMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash the password and create a new user', async () => {
      hashPasswordMock.mockResolvedValue('hashedPassword123');

      (buildInsertQuery as jest.Mock).mockReturnValue({
        query: 'INSERT INTO User (email, password) VALUES (?, ?);',
        values: ['test@example.com', 'hashedPassword123'],
      });

      (User.create as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });

      await userController.create(req as Request, res as Response, next);

      expect(hashPasswordMock).toHaveBeenCalledWith('password123');
      expect(User.create).toHaveBeenCalledWith({
        query: 'INSERT INTO User (email, password) VALUES (?, ?);',
        values: ['test@example.com', 'hashedPassword123'],
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: { id: 1, email: 'test@example.com' },
        message: 'User created successfully.',
        status: 'success',
      });
    });
  });

  describe('uploadPhoto', () => {
    it("should update the user's profile image", async () => {
      (buildUpdateQuery as jest.Mock).mockReturnValue({
        query: 'UPDATE User SET profileImageFileName = ? WHERE id = ?',
        values: ['profile.jpg', 1],
      });
      (User.update as jest.Mock).mockResolvedValue(undefined);

      await userController.uploadPhoto(req as Request, res as Response, next);

      expect(buildUpdateQuery).toHaveBeenCalledWith({ profileImageFileName: 'profile.jpg' }, 'User');
      expect(User.update).toHaveBeenCalledWith({
        id: 1,
        query: 'UPDATE User SET profileImageFileName = ? WHERE id = ?',
        values: ['profile.jpg', 1],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User image uploaded successfully',
        status: 'success',
      });
    });

    it('should throw an error if no file is uploaded', async () => {
      req.file = undefined;

      await expect(userController.uploadPhoto(req as Request, res as Response, next)).rejects.toThrow(AppError);
    });
  });
});
