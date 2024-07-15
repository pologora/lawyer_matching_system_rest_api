import { SpecializationArray, specializations } from './specjalizations';

const createInsertSpecializationsQuery = (spec: SpecializationArray) => {
  return spec.reduce((acc, specialization, idx) => {
    const lastSymbol = idx === spec.length - 1 ? ';' : ',';
    return `${acc}(${idx + 1}, "${specialization}")${lastSymbol}`;
  }, `INSERT INTO specialization (id, name) VALUES `);
};

createInsertSpecializationsQuery(specializations);
