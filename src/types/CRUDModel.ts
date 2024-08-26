import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';

export type CreateProps = {
  query: string;
  values: (string | number | Date)[];
};

export type GetOneProps = {
  query: string;
  id: number;
};

export type GetManyProps = {
  query: string;
  values: (string | number)[];
};

export type UpdateProps = {
  query: string;
  values: (string | number | Date)[];
  id: number;
};

export type RemoveProps = {
  query: string;
  id: number;
};

export interface CRUDModel {
  create(props: CreateProps): Promise<number>;
  getOne(props: GetOneProps): Promise<RowDataPacket>;
  getMany(props: GetManyProps): Promise<QueryResult>;
  update(props: UpdateProps): Promise<ResultSetHeader>;
  remove(props: RemoveProps): Promise<ResultSetHeader>;
}
