import { NextFunction, Request, Response } from 'express';

export interface BaseControllerMethods {
  create(req: Request, res: Response, next: NextFunction): Promise<Response>;
  getOne(req: Request, res: Response, next: NextFunction): Promise<Response>;
  getMany(req: Request, res: Response, next: NextFunction): Promise<Response>;
  update(req: Request, res: Response, next: NextFunction): Promise<Response>;
  remove(req: Request, res: Response, next: NextFunction): Promise<Response>;
}
