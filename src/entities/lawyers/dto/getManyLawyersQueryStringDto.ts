export interface GetManyLawyersQueryStringDto {
  limit?: number;
  page?: number;
  experienceMin?: number;
  experienceMax?: number;
  city?: string;
  region?: string;
  ratingMin?: number;
  ratingMax?: number;
  search?: string;
  sort?: string;
  order?: 'desc' | 'asc';
  specialization?: number;
}
