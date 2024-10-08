import { RowDataPacket } from 'mysql2';
import { BuildInsertQuery } from '../../../types/utils';
import { LawyerModel } from '../../lawyers/types/lawyersTypes';
import { CRUDModel } from '../../../core/types/CRUDModelTypes';

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

export type CreateReviewDto = {
  clientId: number;
  lawyerId: number;
  reviewText: string;
  rating: number;
};

type CreateReviewServiceProps = {
  Review: ReviewModel;
  Lawyer: LawyerModel;
  getReviewQuery: string;
  updateRatingQuery: string;
  buildInsertQuery: BuildInsertQuery;
  data: CreateReviewDto;
};

export type CreateReviewService = (props: CreateReviewServiceProps) => Promise<RowDataPacket>;
