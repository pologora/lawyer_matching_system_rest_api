import { decode } from './decode';
import { sign } from './sign';
import { verify } from './verify';

describe('decode token', () => {
  test('should decode the token payload', () => {
    const payload = { name: 'John' };
    const options = { expiresIn: 9 };
    const token = sign({ payload, secret: 'secret', options });

    const decoded = decode({ token });

    expect(decoded.name).toBe(payload.name);
  });
});

describe('sign token', () => {
  test('should produce different signatures for different payloads', () => {
    const secret = 'secret';
    const jwtOne = sign({
      payload: { name: 'John' },
      secret,
      options: { expiresIn: 2 },
    });

    const jwtTwo = sign({
      payload: { name: 'Tim' },
      secret: secret,
      options: { expiresIn: 2 },
    });

    expect(jwtOne.split('.')[2]).not.toBe(jwtTwo.split('.')[2]);
  });
});

describe('verify token', () => {
  const options = { expiresIn: 9 };
  test('should verify and decode a valid token', () => {
    const secret = 'secret';
    const payload = { name: 'John' };

    const token = sign({ payload, secret, options });
    const verified = verify({ token, secret });

    expect(verified.name).toBe(payload.name);
  });

  test('should throw if the signature is invalid', () => {
    const secret = 'secret';
    const secretTwo = 'different';
    const payload = { name: 'John' };

    const token = sign({ payload, secret, options });

    expect(() => verify({ token, secret: secretTwo })).toThrow();
  });
  test('should throw if the token has expired', () => {
    const secret = 'secret';
    const payload = { name: 'John' };

    const token = sign({ payload, secret, options: { expiresIn: -1 } });

    expect(() => verify({ token, secret })).toThrow();
  });
});
