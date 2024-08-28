/* eslint-disable max-lines-per-function */
import { BuildGetManyLawyersQuery } from '../types/lawyersTypes';

export const buildGetManyLawyersQuery: BuildGetManyLawyersQuery = (queryParams) => {
  const DEFAULT_LIMIT_QUERY_RESULTS = 25;
  const DEFAULT_OFFSET = 0;

  const {
    experienceMin,
    experienceMax,
    cityId,
    regionId,
    ratingMax,
    ratingMin,
    limit,
    order,
    page,
    search,
    sort,
    specialization,
    initialConsultationFeeMin,
    initialConsultationFeeMax,
    hourlyRateMin,
    hourlyRateMax,
  } = queryParams;

  const filters = [];
  const values = [];

  if (initialConsultationFeeMin) {
    filters.push(`lp.initialConsultationFee >= ?`);
    values.push(initialConsultationFeeMin);
  }

  if (initialConsultationFeeMax) {
    filters.push(`lp.initialConsultationFee <= ?`);
    values.push(initialConsultationFeeMax);
  }

  if (hourlyRateMin) {
    filters.push(`lp.hourlyRate >= ?`);
    values.push(hourlyRateMin);
  }

  if (hourlyRateMax) {
    filters.push(`lp.hourlyRate <= ?`);
    values.push(hourlyRateMax);
  }

  if (experienceMin) {
    filters.push(`lp.experience >= ?`);
    values.push(experienceMin);
  }

  if (experienceMin) {
    filters.push(`lp.experience >= ?`);
    values.push(experienceMin);
  }

  if (experienceMax) {
    filters.push(`lp.experience <= ?`);
    values.push(experienceMax);
  }

  if (cityId) {
    filters.push(`lp.cityId = ?`);
    values.push(cityId);
  }

  if (regionId) {
    filters.push(`lp.regionId = ?`);
    values.push(regionId);
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
    filters.push(`s.specializationId = ?`);
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
    lp.hourlyRate,
    lp.initialConsultationFee, 
    lp.firstName, 
    lp.lastName, 
    lp.rating,
    c.name as city,
    r.name as region,
    GROUP_CONCAT(s.name) AS specializations
FROM 
    LawyerProfile lp
LEFT JOIN 
    LawyerSpecialization ls ON lp.lawyerProfileId = ls.lawyerId
LEFT JOIN 
    Specialization s ON ls.specializationId = s.specializationId
LEFT JOIN
    City c on lp.cityId = c.cityId
LEFT JOIN
    Region r on lp.regionId = r.regionId
${filterString}
GROUP BY
    lp.lawyerProfileId, lp.userId, lp.licenseNumber, lp.bio, lp.experience,lp.experience, 
    lp.hourlyRate, lp.firstName, lp.lastName, lp.rating, c.name, r.name
${sortValue}
LIMIT ?
OFFSET ?;`;

  values.push(limitValue, offsetValue);

  return { query, values };
};
