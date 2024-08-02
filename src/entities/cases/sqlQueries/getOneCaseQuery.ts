export const getOneCaseQuery = `
SELECT 
    caseId,
    clientId,
    lawyerId,
    description,
    status,
    title,
    createdAt,
    updatedAt,
    r.name as region,
    c.name as city
FROM \`Case\` cas
LEFT JOIN
    City c on c.cityId = cas.cityId
LEFT JOIN
    Region r on r.regionId = cas.regionId
WHERE caseId = ?;
`;
