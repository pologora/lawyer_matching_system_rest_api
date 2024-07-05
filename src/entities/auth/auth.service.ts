import { createJWT } from '../../utils/createJWT';
import { hashPassword } from '../../utils/hashPassword';
import { CreateUser } from '../users/dto/createUser.dto';
import { User } from '../users/users.model';

export const registerService = async (data: CreateUser) => {
  const { email, password } = data;

  const idxOfEmailSymbol = email.indexOf('@');
  const zeroIdx = 0;
  const username = email.substring(zeroIdx, idxOfEmailSymbol);

  const hashedPassword = await hashPassword(password);

  const { insertId } = await User.create({ username, email, hashedPassword });

  const token = createJWT({ id: insertId });

  return token;
};
