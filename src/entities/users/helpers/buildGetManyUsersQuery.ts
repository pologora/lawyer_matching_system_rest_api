import { BuildGetManyUsersQuery } from '../types/userTypes';

export const buildGetManyUsersQuery: BuildGetManyUsersQuery = (queryParams) => {
  const DEFAULT_LIMIT_QUERY_RESULTS = 25;
  const DEFAULT_OFFSET = 0;

  const defaultColumns = ['userId, email, googleId, role, isVerified, createdAt, updatedAt, profileImageFileName'];

  const { limit, page, sort, order, columns, role, search, isVerified } = queryParams;

  const filters = [];
  const values = [];

  if (role) {
    filters.push(`role = ?`);
    values.push(role);
  }

  if (isVerified) {
    filters.push(`active = ?`);
    values.push(isVerified);
  }

  if (search) {
    filters.push(`email LIKE ?`);
    values.push(`%${search}%`);
  }

  const columnsValue = columns ? columns.split(',').join(', ') : defaultColumns.join(', ');
  const filterString = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const limitValue = limit ? Number(limit) : DEFAULT_LIMIT_QUERY_RESULTS;
  const offsetValue = page ? (page - 1) * limitValue : DEFAULT_OFFSET;
  const sortValue = sort ? `ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}` : '';

  const query = `
SELECT 
${columnsValue}
FROM User
${filterString}
${sortValue}
LIMIT ?
OFFSET ?;`;

  values.push(limitValue, offsetValue);

  return { query, values };
};
