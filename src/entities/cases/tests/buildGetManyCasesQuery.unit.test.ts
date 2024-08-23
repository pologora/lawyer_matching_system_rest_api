/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { GetManyCasesDto } from '../dto';
import { buildGetManyCasesQuery } from '../helpers/buildGetManyCasesQuery';

describe('get many cases query builder', () => {
  test('should return object with a query string and array of parameters', () => {
    const queryParamsObject = {
      cityId: 1,
      clientId: 1,
      lawyerId: 2,
      limit: 1,
      order: 'desc',
      page: 2,
      regionId: 4,
      searchDescription: 'description',
      searchTitle: 'title',
      sort: 'title',
      specializationId: 3,
      status: 'open',
    } as GetManyCasesDto;

    const expectedValues = [
      queryParamsObject.cityId,
      queryParamsObject.regionId,
      queryParamsObject.cityId,
      queryParamsObject.lawyerId,
      queryParamsObject.specializationId,
      `%${queryParamsObject.searchTitle}%`,
      `%${queryParamsObject.searchDescription}%`,
      `%${queryParamsObject.status}%`,
      queryParamsObject.limit,
      //@ts-expect-error ignore
      queryParamsObject.page - 1,
    ];

    const { query, values } = buildGetManyCasesQuery(queryParamsObject);
    expect(typeof query).toBe('string');
    expect(values).toEqual(expectedValues);
  });

  test('should handle default limit and offset when not provided', () => {
    const queryParamsObject = {
      cityId: 1,
      order: 'asc',
      sort: 'title',
    } as GetManyCasesDto;

    const { query, values } = buildGetManyCasesQuery(queryParamsObject);

    const expectedQuery = `
SELECT 
    cas.caseId,
    cas.clientId,
    cas.lawyerId,
    cas.description,
    cas.status,
    cas.title,
    cas.createdAt,
    cas.updatedAt,
    r.name as region,
    c.name as city
FROM \`Case\` cas
LEFT JOIN
    City c on c.cityId = cas.cityId
LEFT JOIN
    Region r on r.regionId = cas.regionId
WHERE cas.cityId = ?
ORDER BY title ASC
LIMIT ?
OFFSET ?;`;

    const expectedValues = [
      1, // cityId
      25, // default limit
      0, // default offset (page 1)
    ];

    expect(query.trim()).toBe(expectedQuery.trim());
    expect(values).toEqual(expectedValues);
  });
});
