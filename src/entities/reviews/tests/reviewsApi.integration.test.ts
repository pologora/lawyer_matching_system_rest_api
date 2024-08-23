/* eslint-disable max-lines-per-function */
import supertest from 'supertest';
import { HTTP_STATUS_CODES } from '../../../utils/statusCodes';
import { app } from '../../../app';
import pool from '../../../config/db.config';

let reviewId: number;
let createReviewData: {
  clientId?: number;
  lawyerId?: number;
  reviewText?: string;
  rating?: number;
};

const createUserDataClient = {
  confirmPassword: 'test12345',
  email: 'reviewclient-test@mail.com',
  password: 'test12345',
};

const createUserDataLawyer = {
  confirmPassword: 'test12345',
  email: 'reviewlawyer-test@mail.com',
  password: 'test12345',
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
    firstName: 'Test review',
    lastName: 'Test review',
    userId: userForClientId,
  };

  const createLawyerData = {
    bio: 'lorem lem',
    cityId: 1,
    experience: 2,
    firstName: 'Test Cases',
    lastName: 'Lawyer',
    licenseNumber: '1111',
    regionId: 2,
    specializations: [1],
    userId: userForLawyerId,
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

  createReviewData = {
    clientId,
    lawyerId,
    rating: 4,
    reviewText: 'test review',
  };
});

afterAll(async () => {
  await pool.end();
});

describe.skip('Test GET /reviews', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get('/api/v1/reviews')
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Reviews retrieved successfully');
  });
});

describe.skip('Test POST /reviews', () => {
  test('Should respond with 201 created', async () => {
    const response = await supertest(app)
      .post('/api/v1/reviews')
      .send(createReviewData)
      .expect(HTTP_STATUS_CODES.CREATED_201)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Successfully created new review');

    // eslint-disable-next-line prefer-destructuring
    reviewId = response.body.data.reviewId;
  });

  test('Should catch missing required properties', async () => {
    const createCaseDataWithMissingProperties = {
      clientId: createReviewData.clientId,
      lawyerId: createReviewData.lawyerId,
    };
    const response = await supertest(app)
      .post('/api/v1/reviews')
      .send(createCaseDataWithMissingProperties)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
  });

  test('Should catch invalid data properties', async () => {
    const invalidCreateClientData = {
      clientId: 999,
      description: 'teste',
      lawyerId: 2,
    };
    const response = await supertest(app)
      .post('/api/v1/reviews')
      .send(invalidCreateClientData)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
  });
});

describe.skip('Test GET /reviews/:id', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get(`/api/v1/reviews/${reviewId}`)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Review retrieved successfully');
    expect(response.body.data).toHaveProperty('reviewId', reviewId);
  });

  test('Should catch not existing client id', async () => {
    const wrongId = 999;
    const response = await supertest(app)
      .get(`/api/v1/reviews/${wrongId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Get. No record found with ID: ${wrongId}`);
  });
});

describe.skip('Test PATCH /reviews/:id', () => {
  test('Should respond with 200 success', async () => {
    const patchData = {
      rating: 3,
      reviewText: 'Patch_review_test',
    };
    const response = await supertest(app)
      .patch(`/api/v1/reviews/${reviewId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Review updated successfully');
    expect(response.body.data).toHaveProperty('reviewId', reviewId);
    expect(response.body.data).toHaveProperty('reviewText', patchData.reviewText);
  });

  test('Should catch not existing client id', async () => {
    const patchData = {
      reviewText: 'review',
    };
    const wrongId = 999;
    const response = await supertest(app)
      .patch(`/api/v1/reviews/${wrongId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Update. No record found with ID: ${wrongId}`);
  });
});

describe.skip('Test DELETE /reviews/:id', () => {
  test('Should respond with 204 no content', async () => {
    await supertest(app).delete(`/api/v1/reviews/${reviewId}`).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  test('Should catch not existing client id', async () => {
    const wrongId = 999;
    const response = await supertest(app)
      .delete(`/api/v1/reviews/${wrongId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Remove. No record found with ID: ${wrongId}`);
  });
});
