/* eslint-disable no-magic-numbers */
import { createHash } from 'crypto';
import { createHashedToken } from '../hashedToken/createHashedToken';
import { createRandomToken } from '../hashedToken/createRandomToken';

const sampleToken = 'test-token';
const expectedHash = createHash('sha256').update(sampleToken).digest('hex');

describe('Test createHashedToken function', () => {
  it('should return a hashed token', () => {
    const hashedToken = createHashedToken(sampleToken);

    expect(hashedToken).toBe(expectedHash);
  });

  it('should return the same hash for the same input', () => {
    const firstHashedToken = createHashedToken(sampleToken);
    const secondHashedToken = createHashedToken(sampleToken);

    expect(firstHashedToken).toBe(secondHashedToken);
  });

  it('should return a different hash for different inputs', () => {
    const firstHashedToken = createHashedToken('first-token');
    const secondHashedToken = createHashedToken('second-token');

    expect(firstHashedToken).not.toBe(secondHashedToken);
  });
});

describe('Test createRandomToken function', () => {
  it('should return a 64-char long string', () => {
    const token = createRandomToken();

    expect(token).toHaveLength(64);
  });

  it('should return different tokens on different function calls', () => {
    const token1 = createRandomToken();
    const token2 = createRandomToken();

    expect(token1).not.toBe(token2);
  });
});
