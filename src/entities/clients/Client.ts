import { RowDataPacket } from 'mysql2';
import { GetOneByUserIdProps } from './types/clientTypes';
import { CRUDModel } from '../../core/CRUDModel';

export class Client extends CRUDModel {
  static async getOneByUserId({ userId, query }: GetOneByUserIdProps) {
    const [result] = await this.pool.query<RowDataPacket[]>(query, [userId]);

    this.checkDatabaseOperation({ id: userId, operation: 'get', result: result[0] });

    return result[0];
  }
}
