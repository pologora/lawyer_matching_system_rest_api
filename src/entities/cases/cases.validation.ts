import Joi from 'joi';

import { CasesStatusEnum } from '../../types/caseStatus';

const statuses = Object.values(CasesStatusEnum);

export const createCaseSchema = Joi.object({
  cityId: Joi.number(),
  clientId: Joi.number().required(),
  description: Joi.string().required(),
  lawyerId: Joi.number().required(),
  regionId: Joi.number(),
  title: Joi.string().required(),
});

export const updateCaseSchema = Joi.object({
  cityId: Joi.number(),
  description: Joi.string(),
  regionId: Joi.number(),
  status: Joi.string().valid(...statuses),
});

const ALLOWED_SORT_FIELDS = ['cityId', 'clientId', 'lawyerId', 'regionId', 'createdAt', 'updatedAt', 'title'];

export const getManyCasesSchema = Joi.object({
  cityId: Joi.number(),
  clientId: Joi.number(),
  lawyerId: Joi.number(),
  limit: Joi.number(),
  order: Joi.valid('desc', 'asc'),
  page: Joi.number(),
  regionId: Joi.number(),
  searchDescription: Joi.string(),
  searchTitle: Joi.string(),
  sort: Joi.valid(...ALLOWED_SORT_FIELDS),
  specializationId: Joi.number(),
  status: Joi.string(),
});
