import { UpdateUser } from '../entities/users/dto/updateUser.dto';

export const patchQueryBuilder = (table: string, columns: UpdateUser, allowedKeys: Set<string>) => {
  const isAllowedKey = (key: string): key is keyof UpdateUser => allowedKeys.has(key);
  const createSetClause = (key: keyof UpdateUser) => `${key} = ?`;
  const getValue = (key: keyof UpdateUser) => columns[key];

  const updateKeys = Object.keys(columns).filter(isAllowedKey);
  const setClauses = updateKeys.map(createSetClause).join(', ');
  const values = updateKeys.map(getValue);

  const query = `UPDATE ${table} SET ${setClauses} WHERE id = ?`;

  return { query, values };
};
