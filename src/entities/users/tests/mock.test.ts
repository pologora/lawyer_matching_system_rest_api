import supertest from 'supertest';
import * as UserService from '../users.service';
import { app } from '../../../app';
import pool from '../../../config/db.config';
import { HTTP_STATUS_CODES } from '../../../utils/statusCodes';

const postData = {
  name: 'test',
  email: 'test@test.test',
  password: 'test',
  confirmPassword: 'test',
};

afterAll(async () => {
  await pool.end();
});

describe('user', () => {
  describe('user creation', () => {
    test('should create a user', async () => {
      //@ts-expect-error description here
      const createUserServiceMock = jest.spyOn(UserService, 'createUser').mockResolvedValueOnce(postData);

      const response = await supertest(app).post('/api/v1/users').send(postData);

      expect(response.statusCode).toBe(HTTP_STATUS_CODES.CREATED_201);
      expect(response.body.data).toEqual(postData);
      expect(createUserServiceMock).toHaveBeenCalledWith(postData);

      createUserServiceMock.mockRestore();
    });
  });
});
