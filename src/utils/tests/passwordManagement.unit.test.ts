import { hashPassword } from '../passwordManagement/hashPassword';
import { comparePasswords } from '../passwordManagement/comparePasswords';

describe('Test comparePasswords function', () => {
  const password = 'password123';
  const wrongPassword = 'password124';
  test('should return true if passwords are the same', async () => {
    const hashedPassword = await hashPassword(password);

    expect(await comparePasswords(password, hashedPassword)).toBeTruthy();
  });
  test('should return false if passwords are not the same', async () => {
    const hashedPassword = await hashPassword(password);

    expect(await comparePasswords(wrongPassword, hashedPassword)).toBeFalsy();
  });
});
