import { IUser } from '../../../types/user';

export interface ChangeMyPasswordDto {
  password: string;
  newPassword: string;
  user: IUser;
}
