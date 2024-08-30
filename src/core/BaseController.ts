import { HTTP_STATUS_CODES as defaultStatusCodes, StatusCodes } from '../config/statusCodes';
import { CRUDModel } from '../types/core/CRUDModel';
import { DatabaseTableNames } from '../types/databaseTableNames';
import { BuildInsertQuery, BuildRemoveQuery, BuildUpdateQuery } from '../types/utils';
import { NextFunction, Response, Request } from 'express';
import { buildRemoveQuery as defaultBuildRemoveQuery } from '../utils/buildDeleteQuery';
import { buildInsertQuery as defaultBuildInsertQuery } from '../utils/buildInsertQuery';
import { buildUpdateQuery as defaultBuildUpdateQuery } from '../utils/buildUpdateQuery';

export interface BaseControllerModel {}

export type BaseControllerProps = {
  model: CRUDModel;
  HTTP_STATUS_CODES?: StatusCodes;
  buildRemoveQuery?: BuildRemoveQuery;
  buildInsertQuery?: BuildInsertQuery;
  buildUpdateQuery?: BuildUpdateQuery;
  buildGetManyQuery: (queryParams: object) => { query: string; values: (string | number | boolean | Date)[] };
  getOneQuery: string;
  tableName: DatabaseTableNames;
};

export class BaseController {
  model: CRUDModel;
  tableName: DatabaseTableNames;
  buildRemoveQuery: BuildRemoveQuery;
  buildInsertQuery: BuildInsertQuery;
  buildUpdateQuery: BuildUpdateQuery;
  buildGetManyQuery: (queryParams: object) => { query: string; values: (string | number | boolean | Date)[] };
  getOneQuery: string;
  HTTP_STATUS_CODES: StatusCodes;
  constructor({
    model,
    tableName,
    HTTP_STATUS_CODES = defaultStatusCodes,
    buildRemoveQuery = defaultBuildRemoveQuery,
    buildInsertQuery = defaultBuildInsertQuery,
    buildUpdateQuery = defaultBuildUpdateQuery,
    buildGetManyQuery,
    getOneQuery,
  }: BaseControllerProps) {
    this.model = model;
    this.tableName = tableName;
    this.buildRemoveQuery = buildRemoveQuery;
    this.buildInsertQuery = buildInsertQuery;
    this.buildUpdateQuery = buildUpdateQuery;
    this.buildGetManyQuery = buildGetManyQuery;
    this.getOneQuery = getOneQuery;
    this.HTTP_STATUS_CODES = HTTP_STATUS_CODES;
  }

  async create(req: Request, res: Response, _next: NextFunction) {
    const { query, values } = this.buildInsertQuery(req.body, this.tableName);

    const newRecordId = await this.model.create({ query, values });

    const newRecord = await this.model.getOne({ id: newRecordId, query: this.getOneQuery });

    return res.status(this.HTTP_STATUS_CODES.CREATED_201).json({
      data: newRecord,
      message: `Successfully created ${this.tableName.toLowerCase()}`,
      status: 'success',
    });
  }

  async getOne(req: Request, res: Response, _next: NextFunction) {
    const record = await this.model.getOne({ id: Number(req.params.id), query: this.getOneQuery });

    return res.status(this.HTTP_STATUS_CODES.SUCCESS_200).json({
      data: record,
      message: `${this.tableName} retrieved successfully`,
      status: 'success',
    });
  }

  async getMany(req: Request, res: Response, _next: NextFunction) {
    const { query, values } = this.buildGetManyQuery(req.query);

    const messages = await this.model.getMany({ query, values });

    return res.status(this.HTTP_STATUS_CODES.SUCCESS_200).json({
      data: messages,
      message: `${this.tableName} list retrieved successfully`,
      status: 'success',
    });
  }

  async update(req: Request, res: Response, _next: NextFunction) {
    const id = Number(req.params.id);

    const { query, values } = this.buildUpdateQuery(req.body, this.tableName);

    await this.model.update({ id, query, values });

    const updatedMessage = await this.model.getOne({ id, query: this.getOneQuery });

    return res.status(this.HTTP_STATUS_CODES.SUCCESS_200).json({
      data: updatedMessage,
      message: `Successfully updated ${this.tableName.toLowerCase()}`,
      status: 'success',
    });
  }

  async remove(req: Request, res: Response, _next: NextFunction) {
    await this.model.remove({ id: Number(req.params.id), query: this.buildRemoveQuery(this.tableName) });

    return res.status(this.HTTP_STATUS_CODES.NO_CONTENT_204).end();
  }
}
