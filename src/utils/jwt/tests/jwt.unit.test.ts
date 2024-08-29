import { decode } from '../decode';
import { sign } from '../sign';
import { verify } from '../verify';

describe('decode token', () => {
  test('should decode the token payload', () => {
    const payload = { name: 'John' };
    const options = { expiresIn: 9 };
    const token = sign({ options, payload, secret: 'secret' });

    const decoded = decode({ token });

    expect(decoded.name).toBe(payload.name);
  });
});

describe('sign token', () => {
  test('should produce different signatures for different payloads', () => {
    const secret = 'secret';
    const jwtOne = sign({
      options: { expiresIn: 2 },
      payload: { name: 'John' },
      secret,
    });

    const jwtTwo = sign({
      options: { expiresIn: 2 },
      payload: { name: 'Tim' },
      secret: secret,
    });

    expect(jwtOne.split('.')[2]).not.toBe(jwtTwo.split('.')[2]);
  });
});

describe('verify token', () => {
  const options = { expiresIn: 9 };
  test('should verify and decode a valid token', () => {
    const secret = 'secret';
    const payload = { name: 'John' };

    const token = sign({ options, payload, secret });
    const verified = verify({ secret, token });

    expect(verified.name).toBe(payload.name);
  });

  test('should throw if the signature is invalid', () => {
    const secret = 'secret';
    const secretTwo = 'different';
    const payload = { name: 'John' };

    const token = sign({ options, payload, secret });

    expect(() => verify({ secret: secretTwo, token })).toThrow();
  });
  test('should throw if the token has expired', () => {
    const secret = 'secret';
    const payload = { name: 'John' };

    const token = sign({ options: { expiresIn: -1 }, payload, secret });

    expect(() => verify({ secret, token })).toThrow();
  });
});
