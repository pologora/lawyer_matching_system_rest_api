import Joi from 'joi';

import { CasesStatusEnum } from '../../types/caseStatus';

const statuses = Object.values(CasesStatusEnum);

export const createCaseSchema = Joi.object({
  clientId: Joi.number().required(),
  lawyerId: Joi.number().required(),
  description: Joi.string().required(),
});

export const updateCaseSchema = Joi.object({
  description: Joi.string(),
  status: Joi.string().valid(...statuses),
});
