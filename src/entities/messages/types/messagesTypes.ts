import { CRUDModel } from '../../../types/core/CRUDModel';

type SortBy = 'createdAt' | 'updatedAt';

type GetManyMessagesQueryParams = {
  limit?: number;
  page?: number;
  senderId?: number;
  receiverId?: number;
  startDate?: Date;
  endDate?: Date;
  sortBy?: SortBy;
  sortOrder?: 'desc' | 'asc';
  search?: string;
};

export type BuildGetManyMessagesQuery = (queryString: GetManyMessagesQueryParams) => {
  query: string;
  values: (string | number | boolean | Date)[];
};

export interface MessagesModule extends CRUDModel {}
