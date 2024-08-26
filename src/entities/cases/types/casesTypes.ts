import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextFunction, Response, Request } from 'express';
import { BuildCreateTableRowQuery, BuildUpdateTableRowQuery } from '../../../types/utils';

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

export interface CasesModel {
  create(props: CreateProps): Promise<number>;
  getOne(props: GetOneProps): Promise<RowDataPacket>;
  getMany(props: GetManyProps): Promise<QueryResult>;
  update(props: UpdateProps): Promise<ResultSetHeader>;
  remove(props: DeleteProps): Promise<ResultSetHeader>;
}

export interface GetManyCasesQueryParams {
  clientId?: number;
  lawyerId?: number;
  specializationId?: number;
  regionId?: number;
  cityId?: number;
  status?: string;
  searchTitle?: string;
  searchDescription?: string;
  limit?: number;
  page?: number;
  sort?: string;
  order?: 'desc' | 'asc';
}

export type BuildGetManyCasesQuery = (queryParams: GetManyCasesQueryParams) => {
  query: string;
  values: (number | string)[];
};

export type CreateCaseController = (props: {
  Case: CasesModel;
  buildCreateTableRowQuery: BuildCreateTableRowQuery;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type GetCaseController = (props: {
  Case: CasesModel;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type GetManyCaseController = (props: {
  Case: CasesModel;
  buildGetManyCasesQuery: BuildGetManyCasesQuery;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type UpdateCaseController = (props: {
  Case: CasesModel;
  buildUpdateTableRowQuery: BuildUpdateTableRowQuery;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type RemoveCaseController = (props: {
  Case: CasesModel;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;
