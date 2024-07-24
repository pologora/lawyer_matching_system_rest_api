import { CasesStatusEnum } from '../../../types/caseStatus';

export interface UpdateCaseDto {
  description?: string;
  status?: CasesStatusEnum;
}
