import Joi from 'joi';

export const getCitiesByRegionSchema = Joi.object({
  regionId: Joi.number().integer().required().messages({
    'any.required': 'Region id is required',
    'number.base': 'Region id must be a number',
    'number.integer': 'Region id must be an integer',
  }),
});
