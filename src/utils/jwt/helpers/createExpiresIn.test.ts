import {
  createExpiresIn,
  millisecondsInDay,
  millisecondsInHour,
  millisecondsInMinute,
  millisecondsInSecond,
} from './createExpiresIn';

describe('Create expireIn JWT from user input', () => {
  test('should correctly convert to milliseconds from strings', () => {
    const inputS = '1s';
    const inputM = '1m';
    const inputH = '1h';
    const inputD = '1d';
    const currentTime = Date.now();

    expect(createExpiresIn(inputS)).toBe(currentTime + millisecondsInSecond);
    expect(createExpiresIn(inputM)).toBe(currentTime + millisecondsInMinute);
    expect(createExpiresIn(inputH)).toBe(currentTime + millisecondsInHour);
    expect(createExpiresIn(inputD)).toBe(currentTime + millisecondsInDay);
  });

  test('should correctly add milliseconds to current time if input is number', () => {
    const currentTime = Date.now();
    const inputInMilliseconds = 100000;

    expect(createExpiresIn(inputInMilliseconds)).toBe(currentTime + inputInMilliseconds);
  });

  test('should throw if input is invalid', () => {
    const invalidInput = '124ff';

    expect(() => createExpiresIn(invalidInput)).toThrow();
  });
});
