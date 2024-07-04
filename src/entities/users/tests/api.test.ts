import supertest from 'supertest';
import { app } from '../../../app';
import { HTTP_STATUS_CODES } from '../../../utils/statusCodes';
import pool from '../../../config/db.config';
import { runTablesSetup } from '../../../config/databaseTables/createTables';

let userId: number;

const postData = {
  name: 'test',
  email: 'test@test.test',
  password: 'test12345',
  confirmPassword: 'test12345',
};

const patchData = { name: 'test updated' };

afterAll(async () => {
  await pool.end();
});

beforeAll(async () => {
  runTablesSetup();
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

    expect(response.body.data).toHaveProperty('affectedRows', 1);
    expect(response.body.data).toHaveProperty('changedRows', 1);
  });
});

describe('Test GET /users/:id', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app).get(`/api/v1/users/${userId}`).expect(HTTP_STATUS_CODES.SUCCESS_200);

    expect(response.body.data[0]).toHaveProperty('id', userId);
    expect(response.body.data[0]).toHaveProperty('name', patchData.name);
    expect(response.body.data[0]).toHaveProperty('email', postData.email);
  });
});

describe('Test DELETE /users/:id', () => {
  test('Should respond with 204 no content', async () => {
    await supertest(app).delete(`/api/v1/users/${userId}`).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });
});
