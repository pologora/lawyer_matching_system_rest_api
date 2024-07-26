import supertest from 'supertest';
import pool from '../../../config/db.config';
import { app } from '../../../app';
import { HTTP_STATUS_CODES } from '../../../utils/statusCodes';

afterAll(async () => {
  await pool.end();
});

describe('Test GET /regions', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get('/api/v1/regions')
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Regions retrieved successfully');
  });
});
