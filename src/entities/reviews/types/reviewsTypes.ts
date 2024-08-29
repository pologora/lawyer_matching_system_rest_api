import { RowDataPacket } from 'mysql2';
import { BuildInsertQuery, BuildRemoveQuery, BuildUpdateQuery } from '../../../types/utils';
import { LawyersProfileModel } from '../../lawyers/types/lawyersTypes';
import { NextFunction, Response, Request } from 'express';
import { CRUDModel } from '../../../types/core/CRUDModel';

export interface ReviewModel extends CRUDModel {}

export type ReviewSort = 'rating' | 'createdAt';

export type GetManyReveiwsQueryParams = {
  sortBy?: ReviewSort;
  sortOrder?: 'desc' | 'asc';
  clientId?: number;
  lawyerId?: number;
  ratingMin?: number;
  ratingMax?: number;
  limit?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
};

export type BuildGetManyReviewsQuery = (queryString: GetManyReveiwsQueryParams) => {
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
  getReviewQuery: string;
  buildCreateTableRowQuery: BuildInsertQuery;
};

export type CreateReviewService = (
  props: CreateReviewServiceProps,
) => (args: { data: CreateReviewDto }) => Promise<RowDataPacket>;

export type CreateReviewController = (args: {
  createReviewService: (props: { data: CreateReviewDto }) => Promise<RowDataPacket>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetReviewController = (props: {
  Review: ReviewModel;
  query: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetManyReviewsController = (props: {
  Review: ReviewModel;
  buildGetManyReviewsQuery: BuildGetManyReviewsQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type UpdateReviewController = (props: {
  Review: ReviewModel;
  getReviewQuery: string;
  buildUpdateTableRowQuery: BuildUpdateQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type RemoveReviewController = (props: {
  Review: ReviewModel;
  buildRemoveQuery: BuildRemoveQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
