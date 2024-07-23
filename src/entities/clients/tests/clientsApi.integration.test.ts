/* eslint-disable max-lines-per-function */
import supertest from 'supertest';
import { HTTP_STATUS_CODES } from '../../../utils/statusCodes';
import { app } from '../../../app';
import pool from '../../../config/db.config';

let userId: number;
let clientId: number;

const createUserData = {
  email: 'clients-test@mail.com',
  password: 'test12345',
  confirmPassword: 'test12345',
};

afterAll(async () => {
  await pool.end();
});

describe('Test GET /clients', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get('/api/v1/clients')
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Client profiles retrieved successfully');
  });
});

describe('Test POST /clients', () => {
  test('Should respond with 201 created', async () => {
    const user = await supertest(app).post('/api/v1/users').send(createUserData).expect(HTTP_STATUS_CODES.CREATED_201);
    userId = user.body.data.insertId;

    const createClientProfileData = {
      userId,
      firstName: 'Client-test',
      lastName: 'Last name test',
    };
    const response = await supertest(app)
      .post('/api/v1/clients')
      .send(createClientProfileData)
      .expect(HTTP_STATUS_CODES.CREATED_201)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Successfully created client profile');

    clientId = response.body.data.clientProfileId;
  });

  test('Should catch missing required properties', async () => {
    const createClientDataWithMissingProperties = {
      firstName: 'Client-test',
      lastName: 'Last name test',
    };
    const response = await supertest(app)
      .post('/api/v1/clients')
      .send(createClientDataWithMissingProperties)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
  });

  test('Should catch invalid data properties', async () => {
    const invalidCreateClientData = {
      userId: 'bad',
      firstName: 'firstname',
      lastName: 'lastname',
    };
    const response = await supertest(app)
      .post('/api/v1/clients')
      .send(invalidCreateClientData)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
  });
});

describe('Test GET /clients/:id', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get(`/api/v1/clients/${clientId}`)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Client profile retrieved successfully');
    expect(response.body.data).toHaveProperty('clientProfileId', clientId);
  });

  test('Should catch not existing client id', async () => {
    const wrongId = 999;
    const response = await supertest(app)
      .get(`/api/v1/clients/${wrongId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Get. No record found with ID: ${wrongId}`);
  });
});

describe('Test PATCH /clients/:id', () => {
  test('Should respond with 200 success', async () => {
    const patchData = {
      firstName: 'Patch_name_test',
    };
    const response = await supertest(app)
      .patch(`/api/v1/clients/${clientId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Successfully updated client profile');
    expect(response.body.data).toHaveProperty('clientProfileId', clientId);
    expect(response.body.data).toHaveProperty('firstName', patchData.firstName);
  });

  test('Should catch not existing client id', async () => {
    const patchData = {
      firstName: 'Patch_name_test',
    };
    const wrongId = 999;
    const response = await supertest(app)
      .patch(`/api/v1/clients/${wrongId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Update. No record found with ID: ${wrongId}`);
  });
});

describe('Test DELETE /clients/:id', () => {
  test('Should respond with 204 no content', async () => {
    await supertest(app).delete(`/api/v1/clients/${clientId}`).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  test('Should catch not existing client id', async () => {
    const wrongId = 999;
    const response = await supertest(app)
      .delete(`/api/v1/clients/${wrongId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Remove. No record found with ID: ${wrongId}`);
  });
});
