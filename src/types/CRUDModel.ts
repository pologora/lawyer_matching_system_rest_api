import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';

export type CreateProps = {
  query: string;
  values: (string | number | Date | boolean)[];
};

export type GetOneProps = {
  query: string;
  id: number;
};

export type GetManyProps = {
  query: string;
  values: (string | number | Date | boolean)[];
};

export type UpdateProps = {
  query: string;
  values: (string | number | Date | boolean)[];
  id: number;
};

export type RemoveProps = {
  query: string;
  id: number;
};

export interface CRUDModel {
  create(props: CreateProps | { email: string; hashedPassword: string }): Promise<number>;
  getOne(props: GetOneProps): Promise<RowDataPacket>;
  getMany(props: GetManyProps | { query: string }): Promise<QueryResult>;
  update(props: UpdateProps): Promise<ResultSetHeader>;
  remove(props: RemoveProps): Promise<ResultSetHeader>;
}
