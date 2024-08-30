/* eslint-disable no-magic-numbers */
/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */

import { buildGetManyMessagesQuery } from '../helpers/buildGetManyMessagesQuery';

describe('buildGetManyMessagesQuery', () => {
  it('should return default query when no queryParams are provided', () => {
    const result = buildGetManyMessagesQuery({});

    expect(result.query.replace(/\s+/g, ' ').trim()).toContain(
      `
  SELECT messageId, senderId, receiverId, message, createdAt, updatedAt
  FROM Message
  ORDER BY ?
  LIMIT ?
  OFFSET ?
  ;`
        .replace(/\s+/g, ' ')
        .trim(),
    );

    expect(result.values).toEqual(['createdAt DESC', 25, 0]);
  });

  it('should add senderId filter to the query', () => {
    const result = buildGetManyMessagesQuery({ senderId: 1 });

    expect(result.query).toContain('WHERE senderId = ?');
    expect(result.values).toEqual([1, 'createdAt DESC', 25, 0]);
  });

  it('should add receiverId filter to the query', () => {
    const result = buildGetManyMessagesQuery({ receiverId: 2 });

    expect(result.query).toContain('WHERE receiverId = ?');
    expect(result.values).toEqual([2, 'createdAt DESC', 25, 0]);
  });

  it('should add startDate filter to the query', () => {
    const result = buildGetManyMessagesQuery({ startDate: '2024-01-01' });

    expect(result.query).toContain('WHERE createdAt >= ?');
    expect(result.values).toEqual(['2024-01-01', 'createdAt DESC', 25, 0]);
  });

  it('should add endDate filter to the query', () => {
    const result = buildGetManyMessagesQuery({ endDate: '2024-12-31' });

    expect(result.query).toContain('WHERE createdAt <= ?');
    expect(result.values).toEqual(['2024-12-31', 'createdAt DESC', 25, 0]);
  });

  it('should add search filter to the query', () => {
    const result = buildGetManyMessagesQuery({ search: 'hello' });

    expect(result.query).toContain('WHERE message LIKE "%?%"');
    expect(result.values).toEqual(['hello', 'createdAt DESC', 25, 0]);
  });

  it('should add sorting and pagination to the query', () => {
    const result = buildGetManyMessagesQuery({ sortBy: 'createdAt', sortOrder: 'asc', limit: 10, page: 2 });

    expect(result.query).toContain('ORDER BY ?');
    expect(result.values).toEqual(['createdAt ASC', 10, 10]);
  });

  it('should handle multiple filters and options', () => {
    const result = buildGetManyMessagesQuery({
      senderId: 1,
      receiverId: 2,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      search: 'hello',
      sortBy: 'createdAt',
      sortOrder: 'asc',
      limit: 5,
      page: 3,
    });

    expect(result.query).toContain(`
  SELECT messageId, senderId, receiverId, message, createdAt, updatedAt
  FROM Message
  WHERE senderId = ? AND receiverId = ? AND createdAt >= ? AND createdAt <= ? AND message LIKE "%?%"
  ORDER BY ?
  LIMIT ?
  OFFSET ?
  ;`);

    expect(result.values).toEqual([1, 2, '2024-01-01', '2024-12-31', 'hello', 'createdAt ASC', 5, 10]);
  });
});
