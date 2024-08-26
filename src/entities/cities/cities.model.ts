import { BaseModel } from '../../core/model/BaseModel';
import { GetManyCitiesProps } from './types/citiesTypes';

export class City extends BaseModel {
  static async getCitiesByRegion({ regionId, query }: GetManyCitiesProps) {
    const result = await this.pool.query(query, [regionId]);

    return result[0];
  }
}
