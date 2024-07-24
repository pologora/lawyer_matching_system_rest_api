/* eslint-disable max-lines-per-function */
import { GetManyLawyersQueryStringDto } from '../dto/getManyLawyersQueryStringDto';

export const buildGetManyLawyersQuery = (queryString: GetManyLawyersQueryStringDto) => {
  const DEFAULT_LIMIT_QUERY_RESULTS = 25;
  const DEFAULT_OFFSET = 0;

  const {
    experienceMin,
    experienceMax,
    city,
    region,
    ratingMax,
    ratingMin,
    limit,
    order,
    page,
    search,
    sort,
    specialization,
  } = queryString;

  const filters = [];
  const values = [];

  if (experienceMin) {
    filters.push(`lp.experience >= ?`);
    values.push(experienceMin);
  }

  if (experienceMax) {
    filters.push(`lp.experience <= ?`);
    values.push(experienceMax);
  }

  if (city) {
    filters.push(`lp.city = ?`);
    values.push(city);
  }

  if (region) {
    filters.push(`lp.region = ?`);
    values.push(region);
  }

  if (ratingMax) {
    filters.push(`lp.rating <= ?`);
    values.push(ratingMax);
  }

  if (ratingMin) {
    filters.push(`lp.rating >= ?`);
    values.push(ratingMin);
  }

  if (specialization) {
    filters.push(`s.id = ?`);
    values.push(specialization);
  }

  if (search) {
    filters.push(`(lp.firstName LIKE ? OR lp.lastName LIKE ?)`);
    values.push(`%${search}%`, `%${search}%`);
  }

  const filterString = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const limitValue = limit ? limit : DEFAULT_LIMIT_QUERY_RESULTS;
  const offsetValue = page ? (page - 1) * limitValue : DEFAULT_OFFSET;
  const sortValue = sort ? `ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}` : '';

  const query = `SELECT 
    lp.lawyerProfileId, 
    lp.userId, 
    lp.licenseNumber, 
    lp.bio, 
    lp.experience, 
    lp.firstName, 
    lp.lastName, 
    lp.city, 
    lp.region, 
    lp.rating,
    GROUP_CONCAT(s.name) AS specializations
FROM 
    LawyerProfile lp
LEFT JOIN 
    LawyerSpecialization ls ON lp.lawyerProfileId = ls.lawyerId
LEFT JOIN 
    Specialization s ON ls.specializationId = s.specializationId
${filterString}
GROUP BY
    lp.lawyerProfileId, lp.userId, lp.licenseNumber, lp.bio, lp.experience, lp.firstName, lp.lastName, lp.city, lp.region, lp.rating
${sortValue}
LIMIT ?
OFFSET ?`;

  values.push(limitValue, offsetValue);

  return { query, values };
};
