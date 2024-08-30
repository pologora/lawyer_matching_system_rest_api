import { BaseController } from '../../core/BaseController';
import { BuildGetManyCasesQuery, CasesModel } from './types/casesTypes';

type CaseControllerConstructorProps = {
  buildGetManyCasesQuery: BuildGetManyCasesQuery;
  getOneCaseQuery: string;
  Case: CasesModel;
};
export class CaseController extends BaseController {
  constructor({ buildGetManyCasesQuery, getOneCaseQuery, Case }: CaseControllerConstructorProps) {
    super({
      buildGetManyQuery: buildGetManyCasesQuery,
      getOneQuery: getOneCaseQuery,
      model: Case,
      tableName: 'Case',
    });
  }
}
