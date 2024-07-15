/* eslint-disable no-console */
import pool from '../db.config';
import { SpecializationArray } from './specjalizations';

export const createInsertSpecializationsQuery = (spec: SpecializationArray) => {
  return spec.reduce((acc, specialization, idx) => {
    const lastSymbol = idx === spec.length - 1 ? ';' : ',';
    return `${acc}(${idx + 1}, "${specialization}")${lastSymbol}`;
  }, `INSERT INTO specializations (id, name) VALUES `);
};

export const insertSpecializations = async (query: string) => {
  try {
    await pool.query(query);
    console.log('Specializations inserted successfully');
  } catch (error) {
    console.log(error);
  }
};
