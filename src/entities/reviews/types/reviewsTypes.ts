import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';
import { BuildCreateTableRowQuery, BuildUpdateTableRowQuery } from '../../../types/utils';
import { LawyersProfileModel } from '../../lawyers/types/lawyersTypes';
import { NextFunction, Response, Request } from 'express';

export type CreateProps = {
  createMessageQuery: string;
  values: (string | number)[];
};

export type GetOneProps = {
  id: number;
};

export type GetManyProps = {
  query: string;
  values: (string | number | Date)[];
};

export type UpdateProps = {
  updateMessageQuery: string;
  values: (string | number)[];
  id: number;
};

export type RemoveProps = {
  id: number;
};

export interface ReviewModel {
  create(props: CreateProps): Promise<number | undefined>;
  getOne(props: GetOneProps): Promise<RowDataPacket>;
  getMany(props: GetManyProps): Promise<QueryResult>;
  update(props: UpdateProps): Promise<ResultSetHeader>;
  remove(props: RemoveProps): Promise<ResultSetHeader>;
}

export type ReviewSort = 'rating' | 'createdAt';

type GetManyReveiwsQueryStringDto = {
  sortBy?: ReviewSort;
  sortOrder?: 'desc' | 'asc';
  clientId?: number;
  lawyerId?: number;
  ratingMin?: number;
  ratingMax?: number;
  limit?: number;
  page?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
};

export type BuildGetManyReviewsQuery = (queryString: GetManyReveiwsQueryStringDto) => {
  query: string;
  values: (string | number | Date)[];
};

type CreateReviewDto = {
  clientId: number;
  lawyerId: number;
  reviewText: string;
  rating: number;
};

type CreateReviewServiceProps = {
  Review: ReviewModel;
  LawyersProfile: LawyersProfileModel;
  buildCreateTableRowQuery: BuildCreateTableRowQuery;
};

export type CreateReviewService = (
  props: CreateReviewServiceProps,
) => (args: { data: CreateReviewDto }) => Promise<RowDataPacket>;

export type CreateReviewController = (args: {
  createReviewService: (props: { data: CreateReviewDto }) => Promise<RowDataPacket>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetReviewController = (props: {
  Review: ReviewModel;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetManyReviewsController = (props: {
  Review: ReviewModel;
  buildGetManyReviewsQuery: BuildGetManyReviewsQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type UpdateReviewController = (props: {
  Review: ReviewModel;
  buildUpdateTableRowQuery: BuildUpdateTableRowQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type RemoveReviewController = (props: {
  Review: ReviewModel;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
