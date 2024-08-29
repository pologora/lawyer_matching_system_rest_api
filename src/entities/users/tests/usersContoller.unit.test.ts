/* eslint-disable no-magic-numbers */
/* eslint-disable sort-keys */
import { Request, Response, NextFunction } from 'express';
import { User } from '../users.model';
import {
  createUserController,
  getManyUsersController,
  getUserController,
  removeUserController,
  updateUserController,
} from '../users.controller';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';

const next: NextFunction = jest.fn();
const query = 'Mock query';

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
} as unknown as Response;

describe('createUserController', () => {
  const hashPasswordMock = jest.fn();
  const userCreateMock = jest.fn();

  const req = {
    body: {
      email: 'test@example.com',
      password: 'password123',
    },
  } as unknown as Request;

  User.create = userCreateMock;

  it('should create a user and return success response', async () => {
    const hashedPassword = 'hashedPassword123';
    hashPasswordMock.mockResolvedValueOnce(hashedPassword);
    userCreateMock.mockResolvedValueOnce({ id: 1, email: 'test@example.com' });

    const controller = createUserController({
      User,
      hashPassword: hashPasswordMock,
      query,
    });

    await controller(req, res, next);

    expect(hashPasswordMock).toHaveBeenCalledWith('password123');
    expect(userCreateMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      hashedPassword,
      query,
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.CREATED_201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'User created successfully.',
      data: { id: 1, email: 'test@example.com' },
    });
  });
});

describe('getUserController', () => {
  const userGetOneMock = jest.fn();
  User.getOne = userGetOneMock;

  const req = {
    params: {
      id: '1',
    },
  } as unknown as Request;

  it('should retrieve a user and return success response', async () => {
    const user = { id: 1, email: 'test@example.com' };
    userGetOneMock.mockResolvedValueOnce(user);

    const controller = getUserController({
      User,
      query,
    });

    await controller(req, res, next);

    expect(userGetOneMock).toHaveBeenCalledWith({ id: 1, query });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'User retrieved successfully.',
      data: user,
    });
  });
});

describe('getManyUsersController', () => {
  const userGetManyMock = jest.fn();
  const buildGetManyUsersQueryMock = jest.fn();

  const req = {
    query: {
      limit: '10',
      page: '1',
    },
  } as unknown as Request;

  beforeEach(() => {
    jest.clearAllMocks();
    User.getMany = userGetManyMock;
    buildGetManyUsersQueryMock.mockReturnValue({
      query,
      values: [10, 0],
    });
  });

  it('should retrieve many users and return success response', async () => {
    const users = [{ id: 1, email: 'test@example.com' }];
    userGetManyMock.mockResolvedValueOnce(users);

    const controller = getManyUsersController({
      User,
      buildGetManyUsersQuery: buildGetManyUsersQueryMock,
    });

    await controller(req, res, next);

    expect(buildGetManyUsersQueryMock).toHaveBeenCalledWith(req.query);
    expect(userGetManyMock).toHaveBeenCalledWith({
      query,
      values: [10, 0],
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Users retrieved successfully.',
      data: users,
    });
  });
});

describe('updateUserController', () => {
  const userUpdateMock = jest.fn();
  const userGetOneMock = jest.fn();
  const buildUpdateTableRowQueryMock = jest.fn();

  const req = {
    params: { id: '1' },
    body: { email: 'newemail@example.com' },
  } as unknown as Request;

  beforeEach(() => {
    jest.clearAllMocks();
    User.update = userUpdateMock;
    User.getOne = userGetOneMock;
    buildUpdateTableRowQueryMock.mockReturnValue({
      query,
      values: ['newemail@example.com'],
    });
  });

  it('should update a user and return success response', async () => {
    const updatedUser = { id: 1, email: 'newemail@example.com' };
    userGetOneMock.mockResolvedValueOnce(updatedUser);

    const controller = updateUserController({
      User,
      buildUpdateTableRowQuery: buildUpdateTableRowQueryMock,
      getUserByIdQuery: 'SELECT * FROM users WHERE id = ?',
    });

    await controller(req, res, next);

    expect(buildUpdateTableRowQueryMock).toHaveBeenCalledWith(req.body, 'User');
    expect(userUpdateMock).toHaveBeenCalledWith({
      id: 1,
      query,
      values: ['newemail@example.com'],
    });
    expect(userGetOneMock).toHaveBeenCalledWith({
      id: 1,
      query: 'SELECT * FROM users WHERE id = ?',
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'User updated successfully.',
      data: updatedUser,
    });
  });
});

describe('removeUserController', () => {
  const userRemoveMock = jest.fn();
  const buildRemoveQueryMock = jest.fn();

  const req = {
    params: { id: '1' },
  } as unknown as Request;

  beforeEach(() => {
    jest.clearAllMocks();
    User.remove = userRemoveMock;
    buildRemoveQueryMock.mockReturnValue(query);
  });

  it('should remove a user and return no content response', async () => {
    const controller = removeUserController({
      User,
      buildRemoveQuery: buildRemoveQueryMock,
    });

    await controller(req, res, next);

    expect(buildRemoveQueryMock).toHaveBeenCalledWith('User');
    expect(userRemoveMock).toHaveBeenCalledWith({
      id: 1,
      query,
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.NO_CONTENT_204);
    expect(res.send).toHaveBeenCalled();
  });
});
