import { NextFunction, Response, Request } from 'express';
import { QueryResult } from 'mysql2';

export type GetManyCitiesProps = {
  regionId: number;
};

export interface CitiesModel {
  getCitiesByRegion(props: GetManyCitiesProps): Promise<QueryResult>;
}

export type GetCitiesByRegion = (props: {
  City: CitiesModel;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
