export const getLawyerByIdQuery = `
SELECT 
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
WHERE lp.id = ?
GROUP BY 
    lp.id, lp.user_id, lp.license_number, lp.bio, lp.experience, lp.first_name, lp.last_name, lp.city, lp.region, lp.rating;`;
