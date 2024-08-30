import Joi from 'joi';

export const createMessageSchema = Joi.object({
  message: Joi.string().required().messages({
    'any.required': 'Message is required.',
    'string.base': 'Message must be a string.',
  }),
  receiverId: Joi.number().required().messages({
    'any.required': 'Receiver ID is required.',
    'number.base': 'Receiver ID must be a number.',
  }),
  senderId: Joi.number().required().messages({
    'any.required': 'Sender ID is required.',
    'number.base': 'Sender ID must be a number.',
  }),
});

export const updateMessageSchema = Joi.object({
  message: Joi.string().required().messages({
    'any.required': 'Message is required.',
    'string.base': 'Message must be a string.',
  }),
});

const sortByValues = ['createdAt', 'updatedAt'];
export const getManyMessagesSchema = Joi.object({
  endDate: Joi.date().messages({
    'date.base': 'End date must be a valid date.',
  }),
  limit: Joi.number().messages({
    'number.base': 'Limit must be a number.',
  }),
  page: Joi.number().messages({
    'number.base': 'Page must be a number.',
  }),
  receiverId: Joi.number().messages({
    'number.base': 'Receiver ID must be a number.',
  }),
  search: Joi.string().messages({
    'string.base': 'Search must be a string.',
  }),
  senderId: Joi.number().messages({
    'number.base': 'Sender ID must be a number.',
  }),
  sortBy: Joi.string()
    .valid(...sortByValues)
    .messages({
      'any.only': `Sort by must be one of the following values: ${sortByValues.join(', ')}.`,
      'string.base': 'Sort by must be a string.',
    }),
  sortOrder: Joi.string().valid('desc', 'asc').messages({
    'any.only': 'Sort order must be either "desc" or "asc".',
    'string.base': 'Sort order must be a string.',
  }),
  startDate: Joi.date().messages({
    'date.base': 'Start date must be a valid date.',
  }),
});
