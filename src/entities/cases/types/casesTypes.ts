import { CRUDModel } from '../../../core/types/CRUDModelTypes';

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
