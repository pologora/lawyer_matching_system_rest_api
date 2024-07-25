export type ReviewSort = 'rating' | 'createdAt';

export interface GetManyReveiwsQueryStringDto {
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
}
