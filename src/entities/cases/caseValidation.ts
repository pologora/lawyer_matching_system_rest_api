import Joi from 'joi';

import { CasesStatusEnum } from '../../types/caseStatus';

const statuses = Object.values(CasesStatusEnum);

export const createCaseSchema = Joi.object({
  cityId: Joi.number().messages({
    'number.base': 'City ID must be a numeric value.',
  }),
  clientId: Joi.number().required().messages({
    'any.required': 'Client ID is required.',
    'number.base': 'Client ID must be a numeric value.',
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description is required.',
    'string.base': 'Description must be a string value.',
  }),
  lawyerId: Joi.number().required().messages({
    'any.required': 'Lawyer ID is required.',
    'number.base': 'Lawyer ID must be a numeric value.',
  }),
  regionId: Joi.number().messages({
    'number.base': 'Region ID must be a numeric value.',
  }),
  title: Joi.string().required().messages({
    'any.required': 'Title is required.',
    'string.base': 'Title must be a string value.',
  }),
});

export const updateCaseSchema = Joi.object({
  cityId: Joi.number().messages({
    'number.base': 'City ID must be a numeric value.',
  }),
  description: Joi.string().messages({
    'string.base': 'Description must be a string value.',
  }),
  regionId: Joi.number().messages({
    'number.base': 'Region ID must be a numeric value.',
  }),
  status: Joi.string()
    .valid(...statuses)
    .messages({
      'any.only': `Status must be one of the following values: ${statuses.join(', ')}.`,
      'string.base': 'Status must be a string value.',
    }),
});

const ALLOWED_SORT_FIELDS = ['cityId', 'clientId', 'lawyerId', 'regionId', 'createdAt', 'updatedAt', 'title'];

export const getManyCasesSchema = Joi.object({
  cityId: Joi.number().messages({
    'number.base': 'City ID must be a numeric value.',
  }),
  clientId: Joi.number().messages({
    'number.base': 'Client ID must be a numeric value.',
  }),
  lawyerId: Joi.number().messages({
    'number.base': 'Lawyer ID must be a numeric value.',
  }),
  limit: Joi.number().messages({
    'number.base': 'Limit must be a numeric value.',
  }),
  order: Joi.string().valid('desc', 'asc').messages({
    'any.only': 'Order must be either "desc" or "asc".',
  }),
  page: Joi.number().messages({
    'number.base': 'Page must be a numeric value.',
  }),
  regionId: Joi.number().messages({
    'number.base': 'Region ID must be a numeric value.',
  }),
  searchDescription: Joi.string().messages({
    'string.base': 'Search description must be a string value.',
  }),
  searchTitle: Joi.string().messages({
    'string.base': 'Search title must be a string value.',
  }),
  sort: Joi.string()
    .valid(...ALLOWED_SORT_FIELDS)
    .messages({
      'any.only': `Sort must be one of the following values: ${ALLOWED_SORT_FIELDS.join(', ')}.`,
      'string.base': 'Sort must be a string value.',
    }),
  specializationId: Joi.number().messages({
    'number.base': 'Specialization ID must be a numeric value.',
  }),
  status: Joi.string().messages({
    'string.base': 'Status must be a string value.',
  }),
});
