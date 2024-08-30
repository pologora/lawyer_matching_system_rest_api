import { BaseController } from '../../core/BaseController';
import { Case } from './Case';
import { buildGetManyCasesQuery } from './helpers/buildGetManyCasesQuery';
import { getOneCaseQuery } from './sqlQueries';

export class CaseController extends BaseController {
  constructor() {
    super({
      buildGetManyQuery: buildGetManyCasesQuery,
      getOneQuery: getOneCaseQuery,
      model: Case,
      tableName: 'Case',
    });
  }
}
