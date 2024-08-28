import { DatabaseTableNames } from './databaseTableNames';

export type DatabaseOperations = 'update' | 'remove' | 'get' | 'create';

export type CheckDatabaseOperationInput = {
  result: object | undefined | number;
  id?: number;
  operation: DatabaseOperations;
};

export type CheckDatabaseOperationResult = ({ result, id, operation }: CheckDatabaseOperationInput) => void;

export type BuildInsertQuery = (
  data: object,
  table: DatabaseTableNames,
) => { query: string; values: (string | number)[] };

export type BuildUpdateQuery = (
  data: object,
  table: DatabaseTableNames,
) => { query: string; values: (string | number)[] };

export type BuildRemoveQuery = (table: DatabaseTableNames) => string;

export type HashPassword = (password: string) => Promise<string>;
