import { ResultSetHeader } from 'mysql2';
import pool from '../../config/db.config';
import { createUserQuery, updateUserRoleQuery } from './sqlQueries';
import { CreateUserProps, SetRoleProps } from './types/userTypes';
import { CRUDModel } from '../../core/model/CRUDModel';

class User extends CRUDModel {
  static async createUser({ email, hashedPassword }: CreateUserProps) {
    const [result] = await pool.query<ResultSetHeader>(createUserQuery, [email, hashedPassword]);

    this.checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result;
  }

  static async setRole({ role, id }: SetRoleProps) {
    const [result] = await pool.query<ResultSetHeader>(updateUserRoleQuery, [role, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }
}

export { User };
