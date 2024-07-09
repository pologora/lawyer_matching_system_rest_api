import {
  createExpiresIn,
  millisecondsInDay,
  millisecondsInHour,
  millisecondsInMinute,
  millisecondsInSecond,
} from './createExpiresIn';

describe('Create expireIn JWT from user input', () => {
  const fixedCurrentTime = 1625097600000;

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => fixedCurrentTime);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should correctly convert to milliseconds from strings', () => {
    const inputS = '1s';
    const inputM = '1m';
    const inputH = '1h';
    const inputD = '1d';

    expect(createExpiresIn(inputS)).toBe(fixedCurrentTime + millisecondsInSecond);
    expect(createExpiresIn(inputM)).toBe(fixedCurrentTime + millisecondsInMinute);
    expect(createExpiresIn(inputH)).toBe(fixedCurrentTime + millisecondsInHour);
    expect(createExpiresIn(inputD)).toBe(fixedCurrentTime + millisecondsInDay);
  });

  test('should correctly add milliseconds to current time if input is number', () => {
    const inputInMilliseconds = 100000;

    expect(createExpiresIn(inputInMilliseconds)).toBe(fixedCurrentTime + inputInMilliseconds);
  });

  test('should throw if input is invalid', () => {
    const invalidInput = '124ff';

    expect(() => createExpiresIn(invalidInput)).toThrow();
  });
});
