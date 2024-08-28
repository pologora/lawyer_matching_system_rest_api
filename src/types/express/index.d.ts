import { IUser } from '../IUser';

declare global {
  namespace Express {
    export interface Request {
      language?: Language;
      user?: IUser;
    }
  }
}

export {};
