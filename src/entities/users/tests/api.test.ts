import supertest from 'supertest';
import { app } from '../../../app';
import { statusCodes } from '../../../utils/statusCodes';
import pool from '../../../config/db.config';

let userId: number;

const postData = {
  name: 'test',
  email: 'test@test.test',
  password: 'test',
  confirmPassword: 'test',
};

const patchData = { name: 'test updated' };

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  // Create a user before each test
  const response = await supertest(app).post('/api/v1/users').send(postData).expect(statusCodes.created);
  userId = response.body.data.insertId;
});

afterEach(async () => {
  // Delete the user after each test
  if (userId) {
    await supertest(app).delete(`/api/v1/users/${userId}`).expect(statusCodes.noContent);
  }
});

describe('Test GET /users', () => {
  test('Should respond with 200 success', async () => {
    await supertest(app).get('/api/v1/users').expect(statusCodes.success).expect('Content-Type', /json/);
  });
});

describe('Test POST /users', () => {
  test('Should respond with 201 created', async () => {
    const response = await supertest(app).post('/api/v1/users').send(postData).expect(statusCodes.created);

    expect(response.body.data).toHaveProperty('affectedRows', 1);
    expect(response.body.data).toHaveProperty('insertId');
    userId = response.body.data.insertId;
  });

  test('Should catch missing required properties', () => {});
  test('Should catch invalid data properties', () => {});
});

describe('Test PATCH /users/:id', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app).patch(`/api/v1/users/${userId}`).send(patchData).expect(statusCodes.success);

    expect(response.body.data).toHaveProperty('affectedRows', 1);
    expect(response.body.data).toHaveProperty('changedRows', 1);
  });
});

describe('Test GET /users/:id', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app).get(`/api/v1/users/${userId}`).expect(statusCodes.success);

    expect(response.body.data[0]).toHaveProperty('id', userId);
    expect(response.body.data[0]).toHaveProperty('name', postData.name);
    expect(response.body.data[0]).toHaveProperty('email', postData.email);
  });
});

describe('Test DELETE /users/:id', () => {
  test('Should respond with 204 no content', async () => {
    await supertest(app).delete(`/api/v1/users/${userId}`).expect(statusCodes.noContent);
  });
});
