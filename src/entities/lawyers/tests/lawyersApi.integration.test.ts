/* eslint-disable max-lines-per-function */
import supertest from 'supertest';
import { HTTP_STATUS_CODES } from '../../../utils/statusCodes';
import { app } from '../../../app';
import pool from '../../../config/db.config';

let userId: number;
let lawyerId: number;

const createUserData = {
  confirmPassword: 'test12345',
  email: 'lawyers-test@mail.com',
  password: 'test12345',
};

afterAll(async () => {
  await pool.end();
});

describe('Test GET /lawyers', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get('/api/v1/lawyers')
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Lawyer profiles retrieved successfully');
  });
});

describe('Test POST /lawyers', () => {
  test('Should respond with 201 created', async () => {
    const user = await supertest(app).post('/api/v1/users').send(createUserData).expect(HTTP_STATUS_CODES.CREATED_201);
    userId = user.body.data.insertId;

    const createLawyerProfileData = {
      bio: 'lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem',
      cityId: 1,
      experience: 2,
      firstName: 'John',
      lastName: 'Doe',
      licenseNumber: '1111',
      regionId: 2,
      specializations: [1],
      userId,
    };

    const response = await supertest(app)
      .post('/api/v1/lawyers')
      .send(createLawyerProfileData)
      .expect(HTTP_STATUS_CODES.CREATED_201)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Successfully created lawyer profile');

    lawyerId = response.body.data.lawyerProfileId;
  });

  test('Should catch missing required properties', async () => {
    const createClientDataWithMissingProperties = {
      firstName: 'Client-test',
      lastName: 'Last name test',
    };
    const response = await supertest(app)
      .post('/api/v1/lawyers')
      .send(createClientDataWithMissingProperties)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
  });

  test('Should catch invalid data properties', async () => {
    const invalidCreateClientData = {
      firstName: 'firstname',
      lastName: 'lastname',
      userId: 'bad',
    };
    const response = await supertest(app)
      .post('/api/v1/lawyers')
      .send(invalidCreateClientData)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
  });
});

describe('Test GET /lawyers/:id', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get(`/api/v1/lawyers/${lawyerId}`)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Lawyer profile retrieved successfully');
    expect(response.body.data).toHaveProperty('lawyerProfileId', lawyerId);
  });

  test('Should catch not existing client id', async () => {
    const wrongId = 999;
    const response = await supertest(app)
      .get(`/api/v1/lawyers/${wrongId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Get. No record found with ID: ${wrongId}`);
  });
});

describe('Test PATCH /lawyers/:id', () => {
  test('Should respond with 200 success', async () => {
    const patchData = {
      firstName: 'Patch_name_test',
      // eslint-disable-next-line no-magic-numbers
      specializations: [3, 5, 7],
    };
    const response = await supertest(app)
      .patch(`/api/v1/lawyers/${lawyerId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Successfully updated lawyer profile');
    expect(response.body.data).toHaveProperty('lawyerProfileId', lawyerId);
    expect(response.body.data).toHaveProperty('firstName', patchData.firstName);
  });

  test('Should catch not existing client id', async () => {
    const patchData = {
      firstName: 'Patch_name_test',
    };
    const wrongId = 999;
    const response = await supertest(app)
      .patch(`/api/v1/lawyers/${wrongId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
  });
});

describe('Test DELETE /lawyers/:id', () => {
  test('Should respond with 204 no content', async () => {
    await supertest(app).delete(`/api/v1/lawyers/${lawyerId}`).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  test('Should catch not existing client id', async () => {
    const wrongId = 999;
    const response = await supertest(app)
      .delete(`/api/v1/lawyers/${wrongId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Remove. No record found with ID: ${wrongId}`);
  });
});
