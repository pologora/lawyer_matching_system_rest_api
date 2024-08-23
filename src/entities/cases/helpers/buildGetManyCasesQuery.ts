/* eslint-disable max-lines-per-function */
import { GetManyCasesDto } from '../dto';

export const buildGetManyCasesQuery = (queryParams: GetManyCasesDto) => {
  const DEFAULT_LIMIT_QUERY_RESULTS = 25;
  const DEFAULT_OFFSET = 0;

  const {
    cityId,
    clientId,
    lawyerId,
    regionId,
    searchDescription,
    searchTitle,
    specializationId,
    status,
    limit,
    page,
    sort,
    order,
  } = queryParams;

  const filters = [];
  const values = [];

  if (cityId) {
    filters.push(`cas.cityId = ?`);
    values.push(cityId);
  }

  if (regionId) {
    filters.push(`cas.regionId = ?`);
    values.push(regionId);
  }

  if (clientId) {
    filters.push(`cas.clientId = ?`);
    values.push(clientId);
  }

  if (lawyerId) {
    filters.push(`cas.lawyerId = ?`);
    values.push(lawyerId);
  }

  if (specializationId) {
    filters.push(`cas.specializationId = ?`);
    values.push(specializationId);
  }

  if (searchTitle) {
    filters.push(`cas.title LIKE ?`);
    values.push(`%${searchTitle}%`);
  }

  if (searchDescription) {
    filters.push(`cas.description LIKE ?`);
    values.push(`%${searchDescription}%`);
  }

  if (status) {
    filters.push(`cas.status LIKE ?`);
    values.push(`%${status}%`);
  }

  const filterString = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const limitValue = limit ? limit : DEFAULT_LIMIT_QUERY_RESULTS;
  const offsetValue = page ? (page - 1) * limitValue : DEFAULT_OFFSET;
  const sortValue = sort ? `ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}` : '';

  const query = `
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
${filterString}
${sortValue}
LIMIT ?
OFFSET ?;`;

  values.push(limitValue, offsetValue);

  return { query, values };
};
