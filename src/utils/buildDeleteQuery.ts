import { BuildRemoveQuery } from '../types/utils';

export const buildRemoveQuery: BuildRemoveQuery = (tableName) => {
  return `DELETE FROM \`${tableName}\` where ${tableName.toLowerCase()}Id = ?`;
};
