import { isTokenExpired } from '../isTokenExpired';
import { millisecondsInMinute } from '../jwt/helpers/createExpiresIn';

describe('Test isTokenExpired function', () => {
  test('should corretly return false if token is not expired', () => {
    const tokenExpireTime = Date.now() + millisecondsInMinute;

    expect(isTokenExpired(new Date(tokenExpireTime))).toBeFalsy();
  });

  test('should corretly return true if token is expired', () => {
    const tokenExpireTime = Date.now() - millisecondsInMinute;

    expect(isTokenExpired(new Date(tokenExpireTime))).toBeTruthy();
  });
});
