/* eslint-disable max-lines-per-function */
import { GetManyLawyersQueryStringDto } from '../dto/getManyLawyersQueryStringDto';

export const buildGetManyLawyersQuery = (queryString: GetManyLawyersQueryStringDto) => {
  const DEFAULT_LIMIT_QUERY_RESULTS = 25;
  const DEFAULT_OFFSET = 0;

  const {
    experience_min,
    experience_max,
    city,
    region,
    rating_max,
    rating_min,
    limit,
    order,
    page,
    search,
    sort,
    specialization,
  } = queryString;

  const filters = [];

  if (experience_min) filters.push(`lp.experience >= ${experience_min}`);
  if (experience_max) filters.push(`lp.experience <= ${experience_max}`);
  if (city) filters.push(`lp.city = '${city}'`);
  if (region) filters.push(`lp.city = '${region}'`);
  if (rating_max) filters.push(`lp.rating <= ${rating_max}`);
  if (rating_min) filters.push(`lp.rating >= ${rating_min}`);
  if (specialization) filters.push(`s.id = ${specialization}`);
  if (search) filters.push(`lp.first_name LIKE '%${search}%' OR lp.last_name LIKE '%${search}%'`);

  const filterString = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const limitValue = limit ? limit : DEFAULT_LIMIT_QUERY_RESULTS;
  const offsetValue = page ? (page - 1) * limitValue : DEFAULT_OFFSET;
  const sortValue = sort ? `ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}` : '';

  const query = `SELECT 
    lp.id, 
    lp.user_id, 
    lp.license_number, 
    lp.bio, 
    lp.experience, 
    lp.first_name, 
    lp.last_name, 
    lp.city, 
    lp.region, 
    lp.rating,
    GROUP_CONCAT(s.name) AS specializations
FROM 
    lawyer_profiles lp
LEFT JOIN 
    lawyer_specializations ls ON lp.id = ls.lawyer_id
LEFT JOIN 
    specializations s ON ls.specialization_id = s.id
${filterString}
GROUP BY
    lp.id, lp.user_id, lp.license_number, lp.bio, lp.experience, lp.first_name, lp.last_name, lp.city, lp.region, lp.rating
${sortValue}
LIMIT ${limitValue}
OFFSET ${offsetValue}
;`;

  return query;
};
