import { IUser } from '../../../types/user';

export interface DeleteMeDto {
  password: string;
  user: IUser;
}
