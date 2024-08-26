import { NextFunction, Response, Request } from 'express';
import { QueryResult } from 'mysql2';

export type GetManyCitiesProps = {
  regionId: number;
  query: string;
};

export interface CitiesModel {
  getCitiesByRegion(props: GetManyCitiesProps): Promise<QueryResult>;
}

export type GetCitiesByRegion = (props: {
  City: CitiesModel;
  query: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
