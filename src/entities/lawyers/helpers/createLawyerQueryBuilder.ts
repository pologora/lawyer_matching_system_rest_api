export const createLawyerQueryBuilder = (data: object) => {
  const values = [];
  const columns = [];
  for (const [key, value] of Object.entries(data)) {
    columns.push(key);
    values.push(value);
  }
  const query = `INSERT INTO lawyer_profile (${columns.join(', ')}) 
  VALUES (${columns.map(() => '?').join(', ')});`;

  return { query, values };
};
