import { DatabaseTableNames } from '../types/databaseTableNames';

export const buildUpdateTableRowQuery = (data: object, table: DatabaseTableNames) => {
  const tableIdField = `${table[0].toLowerCase() + table.slice(1)}Id`;

  const keyValuePairs = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    if (value) {
      keyValuePairs.push(`${key} = ?`);
      values.push(value);
    }
  }
  const query = `UPDATE ${table} SET ${keyValuePairs.join(', ')} WHERE ${tableIdField} = ?;`;

  return { query, values };
};
