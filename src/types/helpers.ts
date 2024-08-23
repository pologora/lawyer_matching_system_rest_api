import { DatabaseTableNames } from './databaseTableNames';

export type BuildCreateTableRowQuery = (
  data: object,
  table: DatabaseTableNames,
) => { query: string; values: (string | number)[] };

export type BuildUpdateTableRowQuery = (
  data: object,
  table: DatabaseTableNames,
) => { query: string; values: (string | number)[] };
