/* eslint-disable max-lines-per-function */

import { AppError } from '../../../core/AppError';
import { createJWT } from '../createJWT';
import { sign } from '../sign';

jest.mock('../sign', () => ({
  sign: jest.fn(),
}));

describe('createJWT', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should create a JWT token successfully', async () => {
    const payload = { id: 1 };
    const mockToken = 'mockedToken';

    process.env.TOKEN_SECRET = 'secret';
    process.env.TOKEN_EXPIRES_IN = '1h';

    (sign as jest.Mock).mockReturnValue(mockToken);

    const token = await createJWT(payload);

    expect(sign).toHaveBeenCalledWith({ options: { expiresIn: '1h' }, payload, secret: 'secret' });
    expect(token).toBe(mockToken);
  });

  it('should throw an error if TOKEN_SECRET is not set', async () => {
    process.env.TOKEN_SECRET = '';
    process.env.TOKEN_EXPIRES_IN = '1h';

    await expect(createJWT({ id: 1 })).rejects.toThrow(AppError);
    await expect(createJWT({ id: 1 })).rejects.toThrow('Environment variables for JWT are not set');
  });

  it('should throw an error if TOKEN_EXPIRES_IN is not set', async () => {
    process.env.TOKEN_SECRET = 'secret';
    process.env.TOKEN_EXPIRES_IN = '';

    await expect(createJWT({ id: 1 })).rejects.toThrow(AppError);
    await expect(createJWT({ id: 1 })).rejects.toThrow('Environment variables for JWT are not set');
  });

  it('should reject if sign function throws an error', async () => {
    const payload = { id: 1 };
    const error = new Error('JWT creation failed');

    process.env.TOKEN_SECRET = 'secret';
    process.env.TOKEN_EXPIRES_IN = '1h';

    (sign as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await expect(createJWT(payload)).rejects.toThrow(error);
  });
});
