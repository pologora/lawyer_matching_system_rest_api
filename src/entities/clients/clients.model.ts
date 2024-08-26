import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { deleteClientQuery, getManyClientsQuery, getOneClientByUserIdQuery, getOneClientQuery } from './slqQueries';
import { CreateProps, GetOneByUserIdProps, GetOneProps, RemoveProps, UpdateProps } from './types/clientTypes';
import { BaseModel } from '../../utils/BaseModel';

export class ClientProfile extends BaseModel {
  static async create({ createUserQuery, values }: CreateProps) {
    const [result] = await pool.query<ResultSetHeader>(createUserQuery, values);

    this.checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result.insertId;
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getOneClientQuery, [id]);

    this.checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getOneByUserId({ userId }: GetOneByUserIdProps) {
    const [result] = await pool.query<RowDataPacket[]>(getOneClientByUserIdQuery, [userId]);

    this.checkDatabaseOperation({ id: userId, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getMany() {
    const result = await pool.query(getManyClientsQuery);

    return result[0];
  }

  static async update({ query, values, id }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(query, [...values, id]);

    this.checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async remove({ id }: RemoveProps) {
    const [result] = await pool.query<ResultSetHeader>(deleteClientQuery, [id]);

    this.checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }
}
