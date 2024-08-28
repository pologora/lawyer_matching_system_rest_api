/* eslint-disable sort-keys */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */

import { buildGetManyLawyersQuery } from '../helpers/biuldGetManyLawyersQuery';

describe('buildGetManyLawyersQuery', () => {
  it('should build query with no filters when no parameters are provided', () => {
    const queryParams = {};

    const { query, values } = buildGetManyLawyersQuery(queryParams);

    expect(query).toContain('SELECT');
    expect(query).toContain('LIMIT ?');
    expect(query).toContain('OFFSET ?');
    expect(values).toEqual([25, 0]);
  });

  it('should build query with filters for experienceMin and experienceMax', () => {
    const queryParams = {
      experienceMin: 5,
      experienceMax: 10,
    };

    const { query, values } = buildGetManyLawyersQuery(queryParams);
    expect(query).toContain('lp.experience >= ?');
    expect(query).toContain('lp.experience <= ?');
    expect(values).toEqual([5, 10, 25, 0]);
  });

  it('should build query with filters for cityId and regionId', () => {
    const queryParams = {
      cityId: 1,
      regionId: 2,
    };

    const { query, values } = buildGetManyLawyersQuery(queryParams);

    expect(query).toContain('lp.cityId = ?');
    expect(query).toContain('lp.regionId = ?');
    expect(values).toEqual([1, 2, 25, 0]);
  });

  it('should build query with filters for ratingMin and ratingMax', () => {
    const queryParams = {
      ratingMin: 3,
      ratingMax: 5,
    };

    const { query, values } = buildGetManyLawyersQuery(queryParams);

    expect(query).toContain('lp.rating >= ?');
    expect(query).toContain('lp.rating <= ?');
    expect(values).toEqual([5, 3, 25, 0]);
  });

  it('should build query with specialization filter', () => {
    const queryParams = {
      specialization: 1,
    };

    const { query, values } = buildGetManyLawyersQuery(queryParams);

    expect(query).toContain('s.specializationId = ?');
    expect(values).toEqual([1, 25, 0]);
  });

  it('should build query with search filter', () => {
    const queryParams = {
      search: 'John',
    };

    const { query, values } = buildGetManyLawyersQuery(queryParams);

    expect(query).toContain('(lp.firstName LIKE ? OR lp.lastName LIKE ?)');
    expect(values).toEqual(['%John%', '%John%', 25, 0]);
  });

  it('should build query with sorting', () => {
    const queryParams = {
      sort: 'rating',
      order: 'desc' as 'desc' | 'asc',
    };

    const { query } = buildGetManyLawyersQuery(queryParams);

    expect(query).toContain('ORDER BY rating DESC');
  });

  it('should apply pagination correctly', () => {
    const queryParams = {
      limit: 10,
      page: 2,
    };

    const { query, values } = buildGetManyLawyersQuery(queryParams);

    expect(query).toContain('LIMIT ?');
    expect(query).toContain('OFFSET ?');
    expect(values).toEqual([10, 10]);
  });

  it('should apply all filters correctly', () => {
    const queryParams = {
      experienceMin: 5,
      experienceMax: 10,
      cityId: 1,
      regionId: 2,
      ratingMin: 3,
      ratingMax: 5,
      specialization: 1,
      search: 'John',
      limit: 10,
      page: 2,
      sort: 'rating',
      order: 'desc' as 'desc' | 'asc',
    };

    const { query, values } = buildGetManyLawyersQuery(queryParams);

    expect(query).toContain('lp.experience >= ?');
    expect(query).toContain('lp.experience <= ?');
    expect(query).toContain('lp.cityId = ?');
    expect(query).toContain('lp.regionId = ?');
    expect(query).toContain('lp.rating >= ?');
    expect(query).toContain('lp.rating <= ?');
    expect(query).toContain('s.specializationId = ?');
    expect(query).toContain('(lp.firstName LIKE ? OR lp.lastName LIKE ?)');
    expect(query).toContain('ORDER BY rating DESC');
    expect(query).toContain('LIMIT ?');
    expect(query).toContain('OFFSET ?');
    expect(values).toEqual([5, 10, 1, 2, 5, 3, 1, '%John%', '%John%', 10, 10]);
  });
});
