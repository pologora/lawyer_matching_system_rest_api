import bcrypt from 'bcrypt';

const saltRounds = 12;

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, saltRounds);

  return hash;
};
