import { createJWT } from '../../utils/createJWT';
import { hashPassword } from '../../utils/hashPassword';
import { CreateUser } from '../users/dto/createUser.dto';
import { User } from '../users/users.model';

export const registerService = async (data: CreateUser) => {
  const { email, password } = data;

  const hashedPassword = await hashPassword(password);

  const { insertId } = await User.create({ email, hashedPassword });

  const token = createJWT({ id: insertId });

  return token;
};
