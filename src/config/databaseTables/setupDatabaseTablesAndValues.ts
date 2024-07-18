/* eslint-disable no-console */
import { exit } from 'process';
import { createDatabaseTablesIfNotExists } from './createTables';
import { createInsertSpecializationsQuery, insertSpecializations } from './insertSpecializations';
import { specializations } from './specjalizations';
import { dropAllTables, dropAllTablesQuery } from './dropAllTables';

export const runTablesSetup = async () => {
  try {
    await dropAllTables(dropAllTablesQuery);
    await createDatabaseTablesIfNotExists();
    await insertSpecializations(createInsertSpecializationsQuery(specializations));
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    exit(1);
  }
};

runTablesSetup();
