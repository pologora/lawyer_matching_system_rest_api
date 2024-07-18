export interface GetManyLawyersQueryStringDto {
  limit?: number;
  page?: number;
  experience_min?: number;
  experience_max?: number;
  city?: string;
  region?: string;
  rating_min?: number;
  rating_max?: number;
  search?: string;
  sort?: string;
  order?: 'desc' | 'asc';
  specialization?: number;
}
