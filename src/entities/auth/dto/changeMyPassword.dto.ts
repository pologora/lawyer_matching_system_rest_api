import { IUser } from '../../../types/IUser';

export interface ChangeMyPasswordDto {
  password: string;
  newPassword: string;
  user: IUser;
}
