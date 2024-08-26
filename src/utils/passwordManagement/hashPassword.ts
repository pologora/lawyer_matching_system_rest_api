import bcrypt from 'bcrypt';
import { HashPassword } from '../../types/utils';

const saltRounds = 12;

export const hashPassword: HashPassword = async (password) => {
  const hash = await bcrypt.hash(password, saltRounds);

  return hash;
};
