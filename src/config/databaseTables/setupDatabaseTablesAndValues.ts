/* eslint-disable no-console */
import { exit } from 'process';
import { createDatabaseTablesIfNotExists } from './createTables';
import { createInsertSpecializationsQuery, insertSpecializations } from './insertSpecializations';
import { specializations } from './specjalizations';

const runTablesSetup = async () => {
  try {
    await createDatabaseTablesIfNotExists();
    await insertSpecializations(createInsertSpecializationsQuery(specializations));
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    if (process.env.NODE_ENV !== 'test') {
      exit(1);
    }
  }
};

runTablesSetup();
