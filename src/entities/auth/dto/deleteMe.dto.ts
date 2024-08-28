import { IUser } from '../../../types/IUser';

export interface DeleteMeDto {
  password: string;
  user: IUser;
}
