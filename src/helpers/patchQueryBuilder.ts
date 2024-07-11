import { UpdateUserDto, UpdateUserKey } from '../entities/users/dto/updateUser.dto';

export const patchQueryBuilder = (table: string, columns: UpdateUserDto, allowedKeys: Set<UpdateUserKey>) => {
  const createSetClause = (key: UpdateUserKey) => `${key} = ?`;
  const getValue = (key: UpdateUserKey) => columns[key];

  const updateKeys = Object.keys(columns).filter((key) => {
    const typedKey = key as UpdateUserKey;
    return allowedKeys.has(typedKey) && columns[typedKey];
  }) as UpdateUserKey[];

  const setClauses = updateKeys.map(createSetClause).join(', ');
  const values = updateKeys.map(getValue);

  const query = `UPDATE ${table} SET ${setClauses} WHERE id = ?`;

  return { query, values };
};
