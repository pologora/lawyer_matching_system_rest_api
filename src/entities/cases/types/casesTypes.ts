import { NextFunction, Response, Request } from 'express';
import { BuildInsertQuery, BuildRemoveQuery, BuildUpdateQuery } from '../../../types/utils';
import { CRUDModel } from '../../../core/types/CRUDModel';

export interface CasesModel extends CRUDModel {}

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
  getOneCaseQuery: string;
  buildCreateTableRowQuery: BuildInsertQuery;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type GetCaseController = (props: {
  Case: CasesModel;
  query: string;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type GetManyCaseController = (props: {
  Case: CasesModel;
  buildGetManyCasesQuery: BuildGetManyCasesQuery;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type UpdateCaseController = (props: {
  Case: CasesModel;
  getOneCaseQuery: string;
  buildUpdateTableRowQuery: BuildUpdateQuery;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type RemoveCaseController = (props: {
  Case: CasesModel;
  buildRemoveQuery: BuildRemoveQuery;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;
