import { GetManyUsersDto } from '../dto';

export const buildGetManyUsersQuery = (queryString: GetManyUsersDto) => {
  const DEFAULT_LIMIT_QUERY_RESULTS = 25;
  const DEFAULT_OFFSET = 0;

  const defaultColumns = ['userId, email, googleId, role, active, createdAt, updatedAt, profileImageFileName'];

  const { limit, page, sort, order, columns, role, search, active } = queryString;

  const filters = [];
  const values = [];

  if (role) {
    filters.push(`role = ?`);
    values.push(role);
  }

  if (active) {
    filters.push(`active = ?`);
    values.push(active);
  }

  if (search) {
    filters.push(`email LIKE ?`);
    values.push(`%${search}%`);
  }

  const columnsValue = columns ? columns.split(',').join(', ') : defaultColumns.join(', ');
  const filterString = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const limitValue = limit ? limit : DEFAULT_LIMIT_QUERY_RESULTS;
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
