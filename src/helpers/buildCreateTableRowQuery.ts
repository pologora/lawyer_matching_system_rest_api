import { DatabaseTableNames } from '../types/databaseTableNames';

export const buildCreateTableRowQuery = (data: object, table: DatabaseTableNames) => {
  const values = [];
  const columns = [];
  for (const [key, value] of Object.entries(data)) {
    columns.push(key);
    values.push(value);
  }
  const query = `INSERT INTO ${table} (${columns.join(', ')}) 
  VALUES (${columns.map(() => '?').join(', ')});`;

  return { query, values };
};
