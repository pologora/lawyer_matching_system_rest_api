import { IUser } from '../user';

declare global {
  namespace Express {
    export interface Request {
      language?: Language;
      user?: IUser;
    }
  }
}

export {};
