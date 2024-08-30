import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { BaseModel } from './BaseModel';
import { CreateProps, GetManyProps, GetOneProps, RemoveProps, UpdateProps } from './types/CRUDModel';

export class CRUDModel extends BaseModel {
  static async create({ query, values }: CreateProps) {
    const [result] = await this.pool.query<ResultSetHeader>(query, values);

    this.checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result.insertId;
  }

  static async getOne({ id, query }: GetOneProps) {
    const [result] = await this.pool.query<RowDataPacket[]>(query, [id]);

    this.checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getMany({ query, values }: GetManyProps) {
    const result = await this.pool.query(query, values);

    return result[0];
  }

  static async update({ query, values, id }: UpdateProps) {
    const [result] = await this.pool.query<ResultSetHeader>(query, [...values, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async remove({ id, query }: RemoveProps) {
    const [result] = await this.pool.query<ResultSetHeader>(query, [id]);

    this.checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }
}
