type SortBy = 'createdAt' | 'updatedAt';

export interface GetManyMessagesQueryStringDto {
  limit?: number;
  page?: number;
  senderId?: number;
  receiverId?: number;
  startDate?: Date;
  endDate?: Date;
  sortBy?: SortBy;
  sortOrder?: 'desc' | 'asc';
  search?: string;
}
