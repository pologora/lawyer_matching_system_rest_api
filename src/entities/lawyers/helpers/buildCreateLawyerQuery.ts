export const buildCreateLawyerQuery = (data: object) => {
  const values = [];
  const columns = [];
  for (const [key, value] of Object.entries(data)) {
    columns.push(key);
    values.push(value);
  }
  const query = `INSERT INTO lawyer_profiles (${columns.join(', ')}) 
  VALUES (${columns.map(() => '?').join(', ')});`;

  return { query, values };
};
