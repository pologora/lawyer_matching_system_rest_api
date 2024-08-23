import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../config/db.config';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';
import { deleteClientQuery, getManyClientsQuery, getOneClientByUserIdQuery, getOneClientQuery } from './slqQueries';

type CreateProps = {
  createUserQuery: string;
  values: (string | number)[];
};

type GetOneProps = {
  id: number;
};

type GetOneByUserIdProps = {
  userId: number;
};

type UpdateProps = {
  query: string;
  values: (string | number)[];
  id: number;
};

type RemoveProps = {
  id: number;
};

export class ClientProfile {
  static async create({ createUserQuery, values }: CreateProps) {
    const [result] = await pool.query<ResultSetHeader>(createUserQuery, values);

    checkDatabaseOperation({ operation: 'create', result: result.affectedRows });

    return result.insertId;
  }

  static async getOne({ id }: GetOneProps) {
    const [result] = await pool.query<RowDataPacket[]>(getOneClientQuery, [id]);

    checkDatabaseOperation({ id, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getOneByUserId({ userId }: GetOneByUserIdProps) {
    const [result] = await pool.query<RowDataPacket[]>(getOneClientByUserIdQuery, [userId]);

    checkDatabaseOperation({ id: userId, operation: 'get', result: result[0] });

    return result[0];
  }

  static async getMany() {
    const result = await pool.query(getManyClientsQuery);

    return result[0];
  }

  static async update({ query, values, id }: UpdateProps) {
    const [result] = await pool.query<ResultSetHeader>(query, [...values, id]);

    checkDatabaseOperation({ id, operation: 'update', result: result.affectedRows });

    return result;
  }

  static async remove({ id }: RemoveProps) {
    const [result] = await pool.query<ResultSetHeader>(deleteClientQuery, [id]);

    checkDatabaseOperation({ id, operation: 'remove', result: result.affectedRows });

    return result;
  }
}
