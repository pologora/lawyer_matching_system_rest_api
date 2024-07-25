/* eslint-disable max-lines-per-function */
import { GetManyReveiwsQueryStringDto } from '../dto/getManyMessagesQueryStringDto';

export const buildGetManyReviewsQuery = (queryString: GetManyReveiwsQueryStringDto) => {
  const defaultLimit = 25;
  const defaultPage = 1;
  const defaultSortBy = 'createdAt';
  const defaultSortOrder = 'desc';

  const {
    limit = defaultLimit,
    page = defaultPage,
    startDate,
    endDate,
    sortBy = defaultSortBy,
    sortOrder = defaultSortOrder,
    search,
    clientId,
    lawyerId,
    ratingMax,
    ratingMin,
  } = queryString;

  const filters = [];
  const values = [];

  if (clientId) {
    filters.push(`clientId = ?`);
    values.push(clientId);
  }

  if (lawyerId) {
    filters.push(`lawyerId = ?`);
    values.push(lawyerId);
  }

  if (ratingMax) {
    filters.push('rating <= ?');
    values.push(ratingMax);
  }

  if (ratingMin) {
    filters.push('rating >= ?');
    values.push(ratingMin);
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
    filters.push(`reviewText LIKE ?`);
    values.push(`%${search}%`);
  }

  const filterValue = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const offsetValue = (page - 1) * limit;
  const sortValue = sortBy + (sortOrder === 'desc' ? ' DESC' : ' ASC');

  const query = `
  SELECT reviewId, clientId, lawyerId, reviewText, rating
  FROM Review
  ${filterValue}
  ORDER BY ?
  LIMIT ?
  OFFSET ?
  ;`;

  values.push(sortValue, limit, offsetValue);
  return { query, values };
};
