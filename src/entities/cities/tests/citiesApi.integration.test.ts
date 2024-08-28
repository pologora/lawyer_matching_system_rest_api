import supertest from 'supertest';
import pool from '../../../config/db.config';
import { app } from '../../../app';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';

afterAll(async () => {
  await pool.end();
});

describe.skip('Test GET /cities?regionId=<id>', () => {
  test('Should respond with 200 success', async () => {
    const regionId = 2;

    const response = await supertest(app)
      .get(`/api/v1/cities?regionId=${regionId}`)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Cities retrieved successfully');
  });
});
