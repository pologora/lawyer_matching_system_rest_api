import { NextFunction, Response, Request } from 'express';
import { QueryResult } from 'mysql2';

export type GetAllProps = {
  query: string;
};

interface RegionsModel {
  getAll(props: GetAllProps): Promise<QueryResult>;
}

export type GetAllRegionsController = (props: {
  Region: RegionsModel;
  query: string;
}) => (_req: Request, res: Response, _next: NextFunction) => Promise<Response>;
