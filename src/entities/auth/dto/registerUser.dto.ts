import { Request } from 'express';

export interface RegisterUserDto {
  email: string;
  password: string;
  req: Request;
}
