import { DatabaseTableNames } from './databaseTableNames';

export type DatabaseOperations = 'update' | 'remove' | 'get' | 'create';

export type CheckDatabaseOperationInput = {
  result: object | undefined | number;
  id?: number;
  operation: DatabaseOperations;
};

export type CheckDatabaseOperationResult = ({ result, id, operation }: CheckDatabaseOperationInput) => void;

export type BuildCreateTableRowQuery = (
  data: object,
  table: DatabaseTableNames,
) => { query: string; values: (string | number)[] };

export type BuildUpdateTableRowQuery = (
  data: object,
  table: DatabaseTableNames,
) => { query: string; values: (string | number)[] };
