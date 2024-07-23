import supertest from 'supertest';
import { app } from '../../../app';
import { HTTP_STATUS_CODES } from '../../../utils/statusCodes';
import pool from '../../../config/db.config';

let userId: number;

const postData = {
  email: 'test@mail.com',
  password: 'test12345',
  confirmPassword: 'test12345',
};

const patchData = { email: 'test2@mail.com' };

afterAll(async () => {
  await pool.end();
});

describe('Test GET /users', () => {
  test('Should respond with 200 success', async () => {
    await supertest(app).get('/api/v1/users').expect(HTTP_STATUS_CODES.SUCCESS_200).expect('Content-Type', /json/);
  });
});

describe('Test POST /users', () => {
  test('Should respond with 201 created', async () => {
    const response = await supertest(app).post('/api/v1/users').send(postData).expect(HTTP_STATUS_CODES.CREATED_201);

    expect(response.body.data).toHaveProperty('affectedRows', 1);
    expect(response.body.data).toHaveProperty('insertId');

    userId = response.body.data.insertId;
  });

  test('Should catch missing required properties', () => {});
  test('Should catch invalid data properties', () => {});
});

describe('Test PATCH /users/:id', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .patch(`/api/v1/users/${userId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.SUCCESS_200);

    expect(response.body.data).toHaveProperty('userId', userId);
    expect(response.body.data).toHaveProperty('email', patchData.email);
  });
});

describe('Test GET /users/:id', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app).get(`/api/v1/users/${userId}`).expect(HTTP_STATUS_CODES.SUCCESS_200);

    expect(response.body.data).toHaveProperty('userId', userId);
    expect(response.body.data).toHaveProperty('email', patchData.email);
  });

  test('Should respond with 404 status if no user found', async () => {
    const notExistingUserId = 9999999999;

    const response = await supertest(app)
      .get(`/api/v1/users/${notExistingUserId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404);

    expect(response.body).toHaveProperty('status', 'error');
  });
});

describe('Test DELETE /users/:id', () => {
  test('Should respond with 204 no content', async () => {
    await supertest(app).delete(`/api/v1/users/${userId}`).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });
});
