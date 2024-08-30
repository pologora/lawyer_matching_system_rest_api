/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */
import { Request, Response, NextFunction } from 'express';
import { UserController } from '../UserController';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';
import { getUserByIdQuery } from '../sqlQueries';

describe('UserController', () => {
  const mockHashPassword = jest.fn();
  const mockBuildInsertQuery = jest.fn();
  const mockBuildUpdateQuery = jest.fn();
  const mockUserCreate = jest.fn();
  const mockUserUpdate = jest.fn();

  const userController = new UserController({
    hashPassword: mockHashPassword,
    buildGetManyUsersQuery: jest.fn(),
    getUserByIdQuery,
    User: {
      create: mockUserCreate,
      update: mockUserUpdate,
    } as any,
  });

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const body = {
    email: 'test@example.com',
    password: 'password123',
  };
  const file = {
    filename: 'test.jpg',
  };
  const params = {
    id: '1',
  };

  const req = {
    body,
    file,
    params,
  } as unknown as Request;

  const next = jest.fn() as NextFunction;

  describe('create', () => {
    it('should create a new user and return success response', async () => {
      const hashedPassword = 'hashedpassword123';
      const query = 'Query';
      const values = [1, 2];
      const data = { userId: 1, email: ' test@example.com' };

      mockHashPassword.mockReturnValue(hashedPassword);
      userController.buildInsertQuery = mockBuildInsertQuery.mockReturnValue({ query, values });
      mockUserCreate.mockResolvedValue(data);

      await userController.create(req, res, next);

      expect(mockHashPassword).toHaveBeenCalledWith(body.password);
      expect(mockBuildInsertQuery).toHaveBeenCalledWith({ email: body.email, password: hashedPassword }, 'User');
      expect(mockUserCreate).toHaveBeenCalledWith({ query, values });
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.CREATED_201);
      expect(res.json).toHaveBeenCalledWith({
        data,
        message: 'User created successfully.',
        status: 'success',
      });
    });
  });

  describe('uploadPhoto', () => {
    it('should upload a photo and return success response', async () => {
      const query = 'Query';
      const values = ['test.jpg', 1];

      userController.buildUpdateQuery = mockBuildUpdateQuery.mockReturnValue({ query, values });
      mockUserUpdate.mockResolvedValue(undefined);

      await userController.uploadPhoto(req, res, next);

      expect(mockBuildUpdateQuery).toHaveBeenCalledWith({ profileImageFileName: 'test.jpg' }, 'User');
      expect(mockUserUpdate).toHaveBeenCalledWith({
        id: 1,
        query,
        values,
      });
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User image uploaded successfully',
        status: 'success',
      });
    });

    it('should throw an error if no file is uploaded', async () => {
      req.file = undefined;

      await expect(userController.uploadPhoto(req as Request, res as Response, next)).rejects.toThrow(
        'No file uploaded. Please upload an image file',
      );
    });
  });
});
// if (!req.file) {
//     throw new this.AppError('No file uploaded. Please upload an image file', this.HTTP_STATUS_CODES.BAD_REQUEST_400);
//   }

//   const id = Number(req.params.id);
//   const { query, values } = this.buildUpdateQuery({ profileImageFileName: req.file.filename }, 'User');

//   await this.model.update({ id, query, values });

//   return res.status(this.HTTP_STATUS_CODES.SUCCESS_200).json({
//     message: 'User image uploaded successfully',
//     status: 'success',
//   });
