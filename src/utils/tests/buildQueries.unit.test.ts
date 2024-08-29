import { buildRemoveQuery } from '../buildDeleteQuery';
import { buildInsertQuery } from '../buildInsertQuery';
import { buildUpdateQuery } from '../buildUpdateQuery';

describe('Test buildRemoveQuery function', () => {
  test('should return valid sql query string', () => {
    const tableName = 'User';
    const result = buildRemoveQuery(tableName);
    const expectedQuery = `DELETE FROM \`User\` where userId = ?`;

    expect(result).toBe(expectedQuery);
  });
});

describe('Test buildInsertQuery function', () => {
  test('should return valid sql query string and values array', () => {
    const tableName = 'Case';
    const data = {
      firstKey: 'first',
      secondKey: 'second',
    };
    const { query, values } = buildInsertQuery(data, tableName);

    const expectedQuery = `INSERT INTO \`Case\` (firstKey, secondKey) 
  VALUES (?, ?);`;
    const expectedValues = ['first', 'second'];

    expect(query).toBe(expectedQuery);
    expect(values).toEqual(expectedValues);
  });
});

describe('Test buildUpdateQuery function', () => {
  test('should return valid sql query string and values array', () => {
    const tableName = 'Case';
    const data = {
      firstKey: 'first',
      secondKey: 'second',
    };
    const { query, values } = buildUpdateQuery(data, tableName);
    const expectedQuery = `UPDATE \`Case\` SET firstKey = ?, secondKey = ? WHERE caseId = ?;`;
    const expectedValues = ['first', 'second'];

    expect(query).toBe(expectedQuery);
    expect(values).toEqual(expectedValues);
  });
});
