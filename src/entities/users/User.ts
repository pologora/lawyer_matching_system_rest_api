import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { GetOneForAuthProps, SetRoleProps } from './types/userTypes';
import { CRUDModel } from '../../core/CRUDModel';

export class User extends CRUDModel {
  static async setRole({ role, id, updateUserRoleQuery }: SetRoleProps) {
    const [result] = await this.pool.query<ResultSetHeader>(updateUserRoleQuery, [role, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async getOneForAuth({ id, query }: GetOneForAuthProps) {
    const [result] = await this.pool.query<RowDataPacket[]>(query, [id]);

    this.checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }
}
