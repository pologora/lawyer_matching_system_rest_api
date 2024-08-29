/* eslint-disable max-lines-per-function */

import { BuildGetManyMessagesQuery } from '../types/messagesTypes';

export const buildGetManyMessagesQuery: BuildGetManyMessagesQuery = (queryParams) => {
  const DEFAULT_LIMIT_QUERY_RESULTS = 25;
  const DEFAULT_OFFSET = 0;
  const DEFAULT_SORT_BY = 'createdAt DESC';
  const { limit, page, senderId, receiverId, startDate, endDate, sortBy, sortOrder, search } = queryParams;

  const filters = [];
  const values = [];

  if (senderId) {
    filters.push(`senderId = ?`);
    values.push(senderId);
  }

  if (receiverId) {
    filters.push(`receiverId = ?`);
    values.push(receiverId);
  }

  if (startDate) {
    filters.push(`createdAt >= ?`);
    values.push(startDate);
  }

  if (endDate) {
    filters.push(`createdAt <= ?`);
    values.push(endDate);
  }

  if (search) {
    filters.push(`message LIKE "%?%"`);
    values.push(search);
  }

  const filterValue = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const limitValue = limit ? Number(limit) : DEFAULT_LIMIT_QUERY_RESULTS;
  const offsetValue = page ? (page - 1) * limitValue : DEFAULT_OFFSET;
  const sortValue = sortBy ? sortBy + (sortOrder === 'desc' ? ' DESC' : ' ASC') : DEFAULT_SORT_BY;

  const query = `
  SELECT messageId, senderId, receiverId, message, createdAt, updatedAt
  FROM Message
  ${filterValue}
  ORDER BY ?
  LIMIT ?
  OFFSET ?
  ;`;

  values.push(sortValue, limitValue, offsetValue);
  return { query, values };
};
