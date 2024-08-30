import { BuildGetManyClientsQuery } from '../types/clientTypes';

export const buildGetManyClientsQuery: BuildGetManyClientsQuery = (queryParams) => {
  const DEFAULT_LIMIT_QUERY_RESULTS = 25;
  const DEFAULT_OFFSET = 0;

  const values = [];
  const { limit, page } = queryParams;

  const limitValue = limit ? Number(limit) : DEFAULT_LIMIT_QUERY_RESULTS;
  const offsetValue = page ? (page - 1) * limitValue : DEFAULT_OFFSET;

  const query = `SELECT userId, clientProfileId, firstName, lastName 
  FROM ClientProfile
  LIMIT ?
  OFFSET ?;`;

  values.push(limitValue, offsetValue);

  return { query, values };
};
