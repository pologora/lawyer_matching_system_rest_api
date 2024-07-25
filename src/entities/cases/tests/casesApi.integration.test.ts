/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */
import supertest from 'supertest';
import { HTTP_STATUS_CODES } from '../../../utils/statusCodes';
import { app } from '../../../app';
import pool from '../../../config/db.config';

let caseId: number;
let createCaseData: {
  clientId?: number;
  lawyerId?: number;
  description?: string;
};

const createUserDataClient = {
  email: 'client-test@mail.com',
  password: 'test12345',
  confirmPassword: 'test12345',
};

const createUserDataLawyer = {
  email: 'lawyer-test@mail.com',
  password: 'test12345',
  confirmPassword: 'test12345',
};

beforeAll(async () => {
  const userForClient = await supertest(app)
    .post('/api/v1/users')
    .send(createUserDataClient)
    .expect(HTTP_STATUS_CODES.CREATED_201);
  const userForClientId = userForClient.body.data.insertId;

  const userForLawyer = await supertest(app)
    .post('/api/v1/users')
    .send(createUserDataLawyer)
    .expect(HTTP_STATUS_CODES.CREATED_201);
  const userForLawyerId = userForLawyer.body.data.insertId;

  const createClientData = {
    firstName: 'Test cases',
    lastName: 'Test cases',
    userId: userForClientId,
  };

  const createLawyerData = {
    userId: userForLawyerId,
    experience: 2,
    licenseNumber: '1111',
    bio: 'lorem lem',
    firstName: 'Test Cases',
    lastName: 'Lawyer',
    city: 'City',
    region: 'Alaska',
    specializations: [1],
  };

  const client = await supertest(app)
    .post('/api/v1/clients')
    .send(createClientData)
    .expect(HTTP_STATUS_CODES.CREATED_201)
    .expect('Content-Type', /json/);
  const clientId = client.body.data.clientProfileId;

  const lawyer = await supertest(app)
    .post('/api/v1/lawyers')
    .send(createLawyerData)
    .expect(HTTP_STATUS_CODES.CREATED_201)
    .expect('Content-Type', /json/);
  const lawyerId = lawyer.body.data.lawyerProfileId;

  createCaseData = {
    description: 'test description',
    lawyerId,
    clientId,
  };
});

afterAll(async () => {
  await pool.end();
});

describe('Test GET /cases', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get('/api/v1/cases')
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Cases retrieved successfully');
  });
});

describe('Test POST /cases', () => {
  test('Should respond with 201 created', async () => {
    const response = await supertest(app)
      .post('/api/v1/cases')
      .send(createCaseData)
      .expect(HTTP_STATUS_CODES.CREATED_201)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Successfully created new case');

    // eslint-disable-next-line prefer-destructuring
    caseId = response.body.data.caseId;
  });

  test('Should catch missing required properties', async () => {
    const createCaseDataWithMissingProperties = {
      clientId: createCaseData.clientId,
      lawyerId: createCaseData.lawyerId,
    };
    const response = await supertest(app)
      .post('/api/v1/cases')
      .send(createCaseDataWithMissingProperties)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
  });

  test('Should catch invalid data properties', async () => {
    const invalidCreateClientData = {
      clientId: 999,
      lawyerId: 2,
      description: 'teste',
    };
    const response = await supertest(app)
      .post('/api/v1/cases')
      .send(invalidCreateClientData)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
  });
});

describe('Test GET /cases/:id', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get(`/api/v1/cases/${caseId}`)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Case retrieved successfully');
    expect(response.body.data).toHaveProperty('caseId', caseId);
  });

  test('Should catch not existing client id', async () => {
    const wrongId = 999;
    const response = await supertest(app)
      .get(`/api/v1/cases/${wrongId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Get. No record found with ID: ${wrongId}`);
  });
});

describe('Test PATCH /cases/:id', () => {
  test('Should respond with 200 success', async () => {
    const patchData = {
      description: 'Patch_name_test',
    };
    const response = await supertest(app)
      .patch(`/api/v1/cases/${caseId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Case updated successfully');
    expect(response.body.data).toHaveProperty('caseId', caseId);
    expect(response.body.data).toHaveProperty('description', patchData.description);
  });

  test('Should catch not existing client id', async () => {
    const patchData = {
      description: 'Patch_name_test',
    };
    const wrongId = 999;
    const response = await supertest(app)
      .patch(`/api/v1/cases/${wrongId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Update. No record found with ID: ${wrongId}`);
  });
});

describe('Test DELETE /cases/:id', () => {
  test('Should respond with 204 no content', async () => {
    await supertest(app).delete(`/api/v1/cases/${caseId}`).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  test('Should catch not existing client id', async () => {
    const wrongId = 999;
    const response = await supertest(app)
      .delete(`/api/v1/cases/${wrongId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Remove. No record found with ID: ${wrongId}`);
  });
});
