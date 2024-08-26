import { BaseModel } from '../../core/model/BaseModel';
import { GetAllProps } from './types/regionsTypes';

export class Region extends BaseModel {
  static async getAll({ query }: GetAllProps) {
    const result = await this.pool.query(query);

    return result[0];
  }
}
