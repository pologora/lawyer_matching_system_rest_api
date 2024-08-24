import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';
import { GetManyCasesDto } from '../dto';
import { NextFunction, Response, Request } from 'express';
import { BuildCreateTableRowQuery, BuildUpdateTableRowQuery, CheckDatabaseOperationResult } from '../../../types/utils';

export type CreateProps = {
  createCaseQuery: string;
  values: (string | number | Date)[];
  checkDatabaseOperation: CheckDatabaseOperationResult;
};

export type GetOneProps = {
  id: number;
  checkDatabaseOperation: CheckDatabaseOperationResult;
};

export type GetManyProps = {
  query: string;
  values: (string | number)[];
};

export type UpdateProps = {
  updateCaseQuery: string;
  values: (string | number | Date)[];
  id: number;
  checkDatabaseOperation: CheckDatabaseOperationResult;
};

export type DeleteProps = {
  id: number;
  checkDatabaseOperation: CheckDatabaseOperationResult;
};

export interface ICasesModel {
  create(props: CreateProps): Promise<number>;
  getOne(props: GetOneProps): Promise<RowDataPacket>;
  getMany(props: GetManyProps): Promise<QueryResult>;
  update(props: UpdateProps): Promise<ResultSetHeader>;
  remove(props: DeleteProps): Promise<ResultSetHeader>;
}

export type BuildGetManyCasesQuery = (queryParams: GetManyCasesDto) => { query: string; values: (number | string)[] };

export type CreateCaseController = (props: {
  Case: ICasesModel;
  buildCreateTableRowQuery: BuildCreateTableRowQuery;
  checkDatabaseOperation: CheckDatabaseOperationResult;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type GetCaseController = (props: {
  Case: ICasesModel;
  checkDatabaseOperation: CheckDatabaseOperationResult;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type GetManyCaseController = (props: {
  Case: ICasesModel;
  buildGetManyCasesQuery: BuildGetManyCasesQuery;
  checkDatabaseOperation: CheckDatabaseOperationResult;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type UpdateCaseController = (props: {
  Case: ICasesModel;
  buildUpdateTableRowQuery: BuildUpdateTableRowQuery;
  checkDatabaseOperation: CheckDatabaseOperationResult;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type RemoveCaseController = (props: {
  Case: ICasesModel;
  checkDatabaseOperation: CheckDatabaseOperationResult;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;
