export interface GetManyCasesDto {
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
