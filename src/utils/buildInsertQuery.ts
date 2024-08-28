import { BuildInsertQuery } from '../types/utils';

export const buildInsertQuery: BuildInsertQuery = (data, table) => {
  const values = [];
  const columns = [];
  for (const [key, value] of Object.entries(data)) {
    columns.push(key);
    values.push(value);
  }
  const query = `INSERT INTO \`${table}\` (${columns.join(', ')}) 
  VALUES (${columns.map(() => '?').join(', ')});`;

  return { query, values };
};
