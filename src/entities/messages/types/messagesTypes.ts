import { NextFunction, Response, Request } from 'express';
import { CRUDModel } from '../../../types/core/CRUDModel';
import { BuildInsertQuery, BuildRemoveQuery, BuildUpdateQuery } from '../../../types/utils';

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

export type CreateMessageController = (props: {
  Message: MessagesModule;
  getMessageQuery: string;
  buildCreateTableRowQuery: BuildInsertQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetMessageController = (props: {
  Message: MessagesModule;
  query: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetManyMessagesController = (props: {
  Message: MessagesModule;
  buildGetManyMessagesQuery: BuildGetManyMessagesQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type UpdateMessageController = (props: {
  Message: MessagesModule;
  getMessageQuery: string;
  buildUpdateTableRowQuery: BuildUpdateQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type RemoveMessageController = (props: {
  Message: MessagesModule;
  buildRemoveQuery: BuildRemoveQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
