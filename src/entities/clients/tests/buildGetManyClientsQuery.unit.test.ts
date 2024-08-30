/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */

import { buildGetManyClientsQuery } from '../helpers/buildGetManyClientsQuery';

describe('buildGetManyClientsQuery', () => {
  it('should return default query when no queryParams are provided', () => {
    const result = buildGetManyClientsQuery({});

    expect(result.query.replace(/\s+/g, ' ').trim()).toContain(
      `
SELECT userId, clientProfileId, firstName, lastName 
  FROM ClientProfile
  LIMIT ?
  OFFSET ?;`
        .replace(/\s+/g, ' ')
        .trim(),
    );

    expect(result.values).toEqual([25, 0]);
  });

  it('should apply the limit and page parameters to the query', () => {
    const result = buildGetManyClientsQuery({ limit: 10, page: 2 });

    expect(result.query.replace(/\s+/g, ' ').trim()).toContain(
      `
SELECT userId, clientProfileId, firstName, lastName 
  FROM ClientProfile
  LIMIT ?
  OFFSET ?;`
        .replace(/\s+/g, ' ')
        .trim(),
    );

    expect(result.values).toEqual([10, 10]);
  });

  it('should use default limit and offset when no limit and page are provided', () => {
    const result = buildGetManyClientsQuery({});

    expect(result.query.replace(/\s+/g, ' ').trim()).toContain(
      `
SELECT userId, clientProfileId, firstName, lastName 
  FROM ClientProfile
  LIMIT ?
  OFFSET ?;`
        .replace(/\s+/g, ' ')
        .trim(),
    );

    expect(result.values).toEqual([25, 0]);
  });

  it('should correctly calculate offset when only page is provided', () => {
    const result = buildGetManyClientsQuery({ page: 3 });

    expect(result.query.replace(/\s+/g, ' ').trim()).toContain(
      `
SELECT userId, clientProfileId, firstName, lastName 
  FROM ClientProfile
  LIMIT ?
  OFFSET ?;`
        .replace(/\s+/g, ' ')
        .trim(),
    );

    expect(result.values).toEqual([25, 50]); // Default limit 25 with page 3 means offset 50
  });

  it('should correctly apply custom limit and page parameters', () => {
    const result = buildGetManyClientsQuery({ limit: 15, page: 4 });

    expect(result.query.replace(/\s+/g, ' ').trim()).toContain(
      `
SELECT userId, clientProfileId, firstName, lastName 
  FROM ClientProfile
  LIMIT ?
  OFFSET ?;`
        .replace(/\s+/g, ' ')
        .trim(),
    );

    expect(result.values).toEqual([15, 45]);
  });
});
