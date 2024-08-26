import supertest from 'supertest';
import { HTTP_STATUS_CODES } from '../../../utils/statusCodes';
import { app } from '../../../app';
import pool from '../../../config/db.config';

let messageId: number;
let createMessageData: {
  senderId?: number;
  receiverId?: number;
  message?: string;
};

const createUserDataSender = {
  confirmPassword: 'test12345',
  email: 'messagessender-test@mail.com',
  password: 'test12345',
};

const createUserDataReceiver = {
  confirmPassword: 'test12345',
  email: 'messagesreceiver-test@mail.com',
  password: 'test12345',
};

beforeAll(async () => {
  const userForSender = await supertest(app)
    .post('/api/v1/users')
    .send(createUserDataSender)
    .expect(HTTP_STATUS_CODES.CREATED_201);
  const userForSenderId = userForSender.body.data.insertId;

  const userForReceiver = await supertest(app)
    .post('/api/v1/users')
    .send(createUserDataReceiver)
    .expect(HTTP_STATUS_CODES.CREATED_201);
  const userForReceiverId = userForReceiver.body.data.insertId;

  createMessageData = {
    message: 'test message',
    receiverId: userForReceiverId,
    senderId: userForSenderId,
  };
});

afterAll(async () => {
  await pool.end();
});

describe.skip('Test GET /messages', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get('/api/v1/messages')
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Messages retrieved successfully');
  });
});

describe.skip('Test POST /messages', () => {
  test('Should respond with 201 created', async () => {
    const response = await supertest(app)
      .post('/api/v1/messages')
      .send(createMessageData)
      .expect(HTTP_STATUS_CODES.CREATED_201)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Successfully created message');

    // eslint-disable-next-line prefer-destructuring
    messageId = response.body.data.messageId;
  });

  test('Should catch missing required properties', async () => {
    const createCaseDataWithMissingProperties = {
      receiverId: createMessageData.receiverId,
      senderId: createMessageData.senderId,
    };

    const response = await supertest(app)
      .post('/api/v1/messages')
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
      .post('/api/v1/messages')
      .send(invalidCreateClientData)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
  });
});

describe.skip('Test GET /messages/:id', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app)
      .get(`/api/v1/messages/${messageId}`)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Message retrieved successfully');
    expect(response.body.data).toHaveProperty('messageId', messageId);
  });

  test('Should catch not existing message id', async () => {
    const wrongId = 999;
    const response = await supertest(app)
      .get(`/api/v1/messages/${wrongId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Get. No record found with ID: ${wrongId}`);
  });
});

describe.skip('Test PATCH /messages/:id', () => {
  test('Should respond with 200 success', async () => {
    const patchData = {
      message: 'patch message',
    };
    const response = await supertest(app)
      .patch(`/api/v1/messages/${messageId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.SUCCESS_200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Successfully updated message');
    expect(response.body.data).toHaveProperty('messageId', messageId);
    expect(response.body.data).toHaveProperty('message', patchData.message);
  });

  test('Should catch not existing client id', async () => {
    const patchData = {
      message: 'message',
    };
    const wrongId = 999;
    const response = await supertest(app)
      .patch(`/api/v1/messages/${wrongId}`)
      .send(patchData)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Update. No record found with ID: ${wrongId}`);
  });
});

describe.skip('Test DELETE /messages/:id', () => {
  test('Should respond with 204 no content', async () => {
    await supertest(app).delete(`/api/v1/messages/${messageId}`).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  test('Should catch not existing message id', async () => {
    const wrongId = 999;
    const response = await supertest(app)
      .delete(`/api/v1/messages/${wrongId}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', `Failed to Remove. No record found with ID: ${wrongId}`);
  });
});
