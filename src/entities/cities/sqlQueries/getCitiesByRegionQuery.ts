export const getCitiesByRegionQuery = `
SELECT cityId, regionId, name
FROM City
WHERE regionId = ?
`;
