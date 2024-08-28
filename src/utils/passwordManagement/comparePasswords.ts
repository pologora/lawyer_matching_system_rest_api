import bcrypt from 'bcrypt';
import { ComparePasswords } from '../../types/utils';

export const comparePasswords: ComparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
