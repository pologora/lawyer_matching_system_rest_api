/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */

import supertest from 'supertest';
import { app } from '../../../app';
import { HTTP_STATUS_CODES } from '../../../utils/statusCodes';
import pool from '../../../config/db.config';
import { verifyJWT } from '../../../utils/jwt/verifyJWT';
import { User } from '../../users/users.model';
import { sendEmail } from '../../../utils/email/email';

jest.mock('../../../utils/email/email');
let sentEmailContent: { from: string; subject: string; text: string; toEmail: string };
let resetPasswordToken: string;

const extractTokenFromEmail = ({ text }: { text: string }) => {
  const startIndex = text.indexOf('password/') + 9;
  return text.slice(startIndex);
};

const registerData = {
  email: 'regitration-test@mail.com',
  password: 'test12345',
  confirmPassword: 'test12345',
};

const changeMyPasswordData = {
  password: registerData.password,
  newPassword: 'changeMyPass',
  confirmNewPassword: 'changeMyPass',
};

const newPasswordAfterReset = {
  password: 'reset-password',
  confirmPassword: 'reset-password',
};

const logInData = {
  email: registerData.email,
  password: newPasswordAfterReset.password,
};

const getJwtFromCookie = (jwtCookie: string) => {
  const startJwtIndex = jwtCookie.indexOf('=');
  const endOfJwtIndex = jwtCookie.indexOf(';');
  return decodeURIComponent(jwtCookie.substring(startJwtIndex + 1, endOfJwtIndex));
};

let registerJWT: string;
let loginJWT: string;
let userId: number;

beforeAll(async () => {
  (sendEmail as jest.Mock).mockImplementation((emailOptions) => {
    sentEmailContent = emailOptions;
    return Promise.resolve();
  });
});

afterAll(async () => {
  await User.remove({ id: userId });
  await pool.end();
});

describe('Test POST /register', () => {
  test('Should respond with 201 created', async () => {
    const response = await supertest(app)
      .post('/api/v1/register')
      .send(registerData)
      .expect(HTTP_STATUS_CODES.CREATED_201);

    expect(response.body).toHaveProperty('message', 'User registered successfully');

    const [cookies] = response.headers['set-cookie'];
    expect(cookies).toBeDefined();

    expect(cookies.length).toBeGreaterThan(0);

    const jwt = getJwtFromCookie(cookies);
    registerJWT = jwt;

    const payload = await verifyJWT(jwt);
    expect(payload).toHaveProperty('id');

    userId = payload.id;
  });

  test('Should catch confirm password dont match', async () => {
    const wrongConfirmPasswordData = {
      email: 'regitration-test-wrong-confirm@mail.com',
      password: 'test12345',
      confirmPassword: 'test',
    };

    const response = await supertest(app)
      .post('/api/v1/register')
      .send(wrongConfirmPasswordData)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(response.body).toHaveProperty('status', 'error');
  });
  test('Should catch duplicate email adress', async () => {
    const response = await supertest(app)
      .post('/api/v1/register')
      .send(registerData)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(response.body).toHaveProperty('status', 'error');
  });
});

describe('Test PATCH /change-my-password', () => {
  test('Should catch wrong current password', async () => {
    const wrongCurrentPassword = {
      password: 'wrongCurrentPassword',
      newPassword: 'changeMyPass',
      confirmNewPassword: 'changeMyPass',
    };
    const response = await supertest(app)
      .patch('/api/v1/change-my-password')
      .set('Cookie', `jwt=${registerJWT}`)
      .send(wrongCurrentPassword)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Invalid  password');
  });

  test('Should catch wrong invalid new password', async () => {
    const wrongCurrentPassword = {
      password: newPasswordAfterReset.password,
      newPassword: 'changeMyPass',
      confirmNewPassword: 'changeMyWrong',
    };
    const response = await supertest(app)
      .patch('/api/v1/change-my-password')
      .set('Cookie', `jwt=${registerJWT}`)
      .send(wrongCurrentPassword)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(response.body).toHaveProperty('status', 'error');
  });
  test('Should responde with 200 success', async () => {
    const response = await supertest(app)
      .patch('/api/v1/change-my-password')
      .set('Cookie', `jwt=${registerJWT}`)
      .send(changeMyPasswordData)
      .expect(HTTP_STATUS_CODES.SUCCESS_200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Password has been changed');
  });
});

describe('Test POST /fogot-password', () => {
  test('Should send a reset password link', async () => {
    const response = await supertest(app)
      .post('/api/v1/forgot-password')
      .send({ email: registerData.email })
      .expect(HTTP_STATUS_CODES.SUCCESS_200);

    expect(response.body).toHaveProperty('message', 'Reset password link was sent to the user email');
    expect(response.body).toHaveProperty('status', 'success');
    expect(sentEmailContent).toHaveProperty('text');

    resetPasswordToken = extractTokenFromEmail(sentEmailContent);
  });

  test('Should catch not existing email adress', async () => {
    const response = await supertest(app)
      .post('/api/v1/forgot-password')
      .send({ email: 'wrongEmail@mail.com' })
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'There is no user with this email adress');
  });

  test('Should catch invalid email adress', async () => {
    const response = await supertest(app)
      .post('/api/v1/forgot-password')
      .send({ email: 'wrongEmail@mail' })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(response.body).toHaveProperty('status', 'error');
  });
});

describe('Test PATCH /reset-password', () => {
  test('Should reset the password with the valid token', async () => {
    const response = await supertest(app)
      .patch(`/api/v1/reset-password/${resetPasswordToken}`)
      .send(newPasswordAfterReset);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Password has been changed');
  });

  test('Should catch invalid token', async () => {
    const wrongResetPasswordToken = 'wrong-token';
    const response = await supertest(app)
      .patch(`/api/v1/reset-password/${wrongResetPasswordToken}`)
      .send(newPasswordAfterReset);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Invalid reset password token');
  });
});

describe('Test POST /login', () => {
  test('Should respond with 200 success', async () => {
    const response = await supertest(app).post('/api/v1/login').send(logInData).expect(HTTP_STATUS_CODES.SUCCESS_200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body.data).toHaveProperty('userId', userId);

    expect(response.body.data).toHaveProperty('email', logInData.email);

    const [cookies] = response.headers['set-cookie'];
    expect(cookies).toBeDefined();

    expect(cookies.length).toBeGreaterThan(0);

    const jwt = getJwtFromCookie(cookies);
    loginJWT = jwt;
    const payload = await verifyJWT(jwt);

    expect(payload).toHaveProperty('id');
    expect(payload.id).toBe(userId);
  });

  test('Should catch wrong password', async () => {
    const wrongPasswordData = {
      email: logInData.email,
      password: 'wrong',
    };

    const response = await supertest(app)
      .post('/api/v1/login')
      .send(wrongPasswordData)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

    expect(response.body).toHaveProperty('status', 'error');
  });
  test('Should catch wrong email', async () => {
    const wrongEmailData = {
      email: 'wrongmail@mail.com',
      password: 'wrong',
    };

    const response = await supertest(app)
      .post('/api/v1/login')
      .send(wrongEmailData)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

    expect(response.body).toHaveProperty('status', 'error');
  });

  test('Should catch invalid input data', async () => {
    const wrongInputData = {
      email: 2,
      password: 'asdkfa',
    };
    await supertest(app).post('/api/v1/login').send(wrongInputData).expect(HTTP_STATUS_CODES.BAD_REQUEST_400);
  });
});

describe('Test PATCH /delete-me', () => {
  test('Should response with 204 no content', async () => {
    await supertest(app)
      .patch('/api/v1/delete-me')
      .set('Cookie', `jwt=${loginJWT}`)
      .send({ password: logInData.password })
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });
});
