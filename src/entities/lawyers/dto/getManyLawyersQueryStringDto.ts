export interface GetManyLawyersQueryStringDto {
  limit?: number;
  page?: number;
  experienceMin?: number;
  experienceMax?: number;
  cityId?: string;
  regionId?: string;
  ratingMin?: number;
  ratingMax?: number;
  search?: string;
  sort?: string;
  order?: 'desc' | 'asc';
  specialization?: number;
  initialConsultationFeeMin?: number;
  initialConsultationFeeMax?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
}
