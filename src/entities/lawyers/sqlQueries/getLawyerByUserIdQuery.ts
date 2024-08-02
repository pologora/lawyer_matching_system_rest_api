export const getLawyerByUserIdQuery = `
SELECT 
    lp.lawyerProfileId, 
    lp.userId, 
    lp.licenseNumber, 
    lp.bio, 
    lp.experience, 
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
WHERE lp.userId = ?
GROUP BY 
    lp.lawyerProfileId, lp.userId, lp.licenseNumber, lp.bio, lp.experience, lp.firstName, lp.lastName, c.name, r.name, lp.rating;`;
