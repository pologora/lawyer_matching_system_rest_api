import { AppError } from '../../../core/AppError';
import { verify } from '../verify';
import { verifyJWT } from '../verifyJWT';

jest.mock('../verify', () => ({
  verify: jest.fn(),
}));

describe('verifyJWT', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should verify the JWT token successfully', async () => {
    const token = 'validToken';
    const mockPayload = { email: 'test@example.com', id: 1 };

    process.env.TOKEN_SECRET = 'secret';

    (verify as jest.Mock).mockReturnValue(mockPayload);

    const payload = await verifyJWT(token);

    expect(verify).toHaveBeenCalledWith({ secret: 'secret', token });
    expect(payload).toEqual(mockPayload);
  });

  it('should throw an error if TOKEN_SECRET is not set', async () => {
    process.env.TOKEN_SECRET = '';

    await expect(verifyJWT('token')).rejects.toThrow(AppError);
    await expect(verifyJWT('token')).rejects.toThrow('Token secret environment variable is not set');
  });

  it('should reject if verification fails', async () => {
    const token = 'invalidToken';
    const error = new Error('Invalid token');

    process.env.TOKEN_SECRET = 'secret';

    (verify as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await expect(verifyJWT(token)).rejects.toThrow(AppError);
    await expect(verifyJWT(token)).rejects.toThrow('Invalid token');
  });
});
