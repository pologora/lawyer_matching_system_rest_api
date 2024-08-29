/* eslint-disable no-magic-numbers */
/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */

import { buildGetManyUsersQuery } from '../helpers/buildGetManyUsersQuery';
import { GetManyUsersQueryParams } from '../types/userTypes';

describe('buildGetManyUsersQuery', () => {
  it('should return default query when no queryParams are provided', () => {
    const queryParams: GetManyUsersQueryParams = {};

    const { query, values } = buildGetManyUsersQuery(queryParams);

    expect(query.replace(/\s+/g, ' ').trim()).toContain(
      `SELECT
       userId, email, googleId, role, isVerified, createdAt, updatedAt, profileImageFileName`
        .replace(/\s+/g, ' ')
        .trim(),
    );
    expect(query).toContain('FROM User');
    expect(query).toContain('LIMIT ?');
    expect(query).toContain('OFFSET ?');
    expect(values).toEqual([25, 0]);
  });

  it('should filter by role and isVerified', () => {
    const queryParams: GetManyUsersQueryParams = {
      role: 'admin',
      isVerified: true,
    };

    const { query, values } = buildGetManyUsersQuery(queryParams);

    expect(query).toContain('WHERE role = ? AND active = ?');
    expect(values).toEqual(['admin', true, 25, 0]);
  });

  it('should handle search query', () => {
    const queryParams: GetManyUsersQueryParams = {
      search: 'test@example.com',
    };

    const { query, values } = buildGetManyUsersQuery(queryParams);

    expect(query).toContain('WHERE email LIKE ?');
    expect(values).toEqual(['%test@example.com%', 25, 0]);
  });

  it('should handle custom columns', () => {
    const queryParams: GetManyUsersQueryParams = {
      columns: 'userId,email',
    };

    const { query } = buildGetManyUsersQuery(queryParams);

    expect(query).toContain('SELECT userId,email');
  });

  it('should handle sorting and pagination', () => {
    const queryParams: GetManyUsersQueryParams = {
      sort: 'email',
      order: 'asc',
      limit: 10,
      page: 2,
    };

    const { query, values } = buildGetManyUsersQuery(queryParams);

    expect(query).toContain('ORDER BY email ASC');
    expect(values).toEqual([10, 10]); // Limit and offset for page 2
  });

  it('should handle multiple filters and options', () => {
    const queryParams: GetManyUsersQueryParams = {
      role: 'user',
      isVerified: false,
      search: 'john',
      sort: 'createdAt',
      order: 'desc',
      limit: 15,
      page: 3,
    };

    const { query, values } = buildGetManyUsersQuery(queryParams);

    expect(query.replace(/\s+/g, ' ').trim()).toContain(
      'WHERE role = ? AND isVerified = ? AND email LIKE ?'.replace(/\s+/g, ' ').trim(),
    );
    expect(query).toContain('ORDER BY createdAt DESC');
    expect(values).toEqual(['user', false, '%john%', 15, 30]);
  });
});
