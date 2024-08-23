import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';
import { GetManyCasesDto } from '../dto';
import { BuildCreateTableRowQuery } from '../../../types/helpers';
import { NextFunction, Response, Request } from 'express';

export type CreateProps = {
  createCaseQuery: string;
  values: (string | number | Date)[];
};

export type GetOneProps = {
  id: number;
};

export type GetManyProps = {
  query: string;
  values: (string | number)[];
};

export type UpdateProps = {
  updateCaseQuery: string;
  values: (string | number | Date)[];
  id: number;
};

export type DeleteProps = {
  id: number;
};

export interface ICasesModel {
  create(props: CreateProps): Promise<number>;
  getOne(props: GetOneProps): Promise<RowDataPacket>;
  getMany(props: GetManyProps): Promise<QueryResult>;
  update(props: UpdateProps): Promise<ResultSetHeader>;
  remove(props: DeleteProps): Promise<ResultSetHeader>;
}

export type BuildGetManyCasesQuery = (queryParams: GetManyCasesDto) => { query: string; values: (number | string)[] };

export interface CreateCaseController {
  (Case: ICasesModel, buildCreateTableRowQuery: BuildCreateTableRowQuery): (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
