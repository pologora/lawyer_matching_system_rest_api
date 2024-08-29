/* eslint-disable prefer-const */
/* eslint-disable sort-keys */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */

import { buildGetManyReviewsQuery } from '../helpers/buildGetManyReviewsQuery';
import { GetManyReveiwsQueryParams } from '../types/reviewsTypes';

describe('buildGetManyReviewsQuery', () => {
  it('should generate a query with default values when no parameters are provided', () => {
    const queryParams: GetManyReveiwsQueryParams = {};
    let { query, values } = buildGetManyReviewsQuery(queryParams);

    query = query.replace(/\s+/g, ' ').trim();

    expect(query).toContain(
      'SELECT reviewId, clientId, lawyerId, reviewText, rating FROM Review'.replace(/\s+/, ' ').trim(),
    );
    expect(query).toContain('ORDER BY');
    expect(query).toContain('LIMIT ? OFFSET ?');
    expect(values).toEqual(['createdAt DESC', 25, 0]);
  });

  it('should add a filter for clientId when provided', () => {
    const queryParams: GetManyReveiwsQueryParams = { clientId: 123 };
    let { query, values } = buildGetManyReviewsQuery(queryParams);

    query = query.replace(/\s+/g, ' ').trim();

    expect(query).toContain('WHERE clientId = ?');
    expect(values).toContain(123);
  });

  it('should add a filter for lawyerId when provided', () => {
    const queryParams: GetManyReveiwsQueryParams = { lawyerId: 456 };
    let { query, values } = buildGetManyReviewsQuery(queryParams);

    query = query.replace(/\s+/g, ' ').trim();

    expect(query).toContain('WHERE lawyerId = ?');
    expect(values).toContain(456);
  });

  it('should add filters for ratingMin and ratingMax when provided', () => {
    const queryParams: GetManyReveiwsQueryParams = { ratingMin: 2, ratingMax: 5 };
    let { query, values } = buildGetManyReviewsQuery(queryParams);

    query = query.replace(/\s+/g, ' ').trim();

    expect(query).toContain('rating >= ?');
    expect(query).toContain('rating <= ?');
    expect(values).toContain(2);
    expect(values).toContain(5);
  });

  it('should add filters for startDate and endDate when provided', () => {
    const queryParams: GetManyReveiwsQueryParams = { startDate: '2023-01-01', endDate: '2023-12-31' };
    let { query, values } = buildGetManyReviewsQuery(queryParams);

    query = query.replace(/\s+/g, ' ').trim();

    expect(query).toContain('createdAt >= ?');
    expect(query).toContain('createdAt <= ?');
    expect(values).toContain('2023-01-01');
    expect(values).toContain('2023-12-31');
  });

  it('should add a search filter when provided', () => {
    const queryParams: GetManyReveiwsQueryParams = { search: 'excellent' };
    let { query, values } = buildGetManyReviewsQuery(queryParams);

    query = query.replace(/\s+/g, ' ').trim();

    expect(query).toContain('reviewText LIKE ?');
    expect(values).toContain('%excellent%');
  });

  it('should correctly handle pagination', () => {
    const queryParams: GetManyReveiwsQueryParams = { limit: 10, page: 2 };
    let { query, values } = buildGetManyReviewsQuery(queryParams);

    query = query.replace(/\s+/g, ' ').trim();

    expect(query).toContain('LIMIT ? OFFSET ?');
    expect(values).toEqual(['createdAt DESC', 10, 10]);
  });

  it('should apply sorting based on provided sortBy and sortOrder', () => {
    const queryParams: GetManyReveiwsQueryParams = { sortBy: 'rating', sortOrder: 'asc' };
    let { query, values } = buildGetManyReviewsQuery(queryParams);

    query = query.replace(/\s+/g, ' ').trim();

    expect(query).toContain('ORDER BY');
    expect(values).toContain('rating ASC');
  });

  it('should handle complex query with multiple filters and sorting', () => {
    const queryParams: GetManyReveiwsQueryParams = {
      clientId: 123,
      lawyerId: 456,
      ratingMin: 3,
      ratingMax: 5,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      search: 'great service',
      sortBy: 'rating',
      sortOrder: 'desc',
      limit: 5,
      page: 3,
    };
    let { query, values } = buildGetManyReviewsQuery(queryParams);

    query = query.replace(/\s+/g, ' ').trim();

    expect(query).toContain('WHERE clientId = ?');
    expect(query).toContain('AND lawyerId = ?');
    expect(query).toContain('AND rating >= ?');
    expect(query).toContain('AND rating <= ?');
    expect(query).toContain('AND createdAt >= ?');
    expect(query).toContain('AND createdAt <= ?');
    expect(query).toContain('AND reviewText LIKE ?');
    expect(query).toContain('LIMIT ? OFFSET ?');
    expect(query).toContain('ORDER BY');
    expect(query).toContain('LIMIT ? OFFSET ?');
    expect(values).toEqual([123, 456, 5, 3, '2023-01-01', '2023-12-31', '%great service%', 'rating DESC', 5, 10]);
  });
});
