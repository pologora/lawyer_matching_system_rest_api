import Joi from 'joi';

export const createMessageSchema = Joi.object({
  senderId: Joi.number().required(),
  receiverId: Joi.number().required(),
  message: Joi.string().required(),
});

export const updateMessageSchema = Joi.object({
  message: Joi.string().required(),
});

const sortByValues = ['createdAt', 'updatedAt'];
export const getManyMessagesShema = Joi.object({
  limit: Joi.number(),
  page: Joi.number(),
  senderId: Joi.number(),
  receiverId: Joi.number(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  sortBy: Joi.valid(...sortByValues),
  sortOrder: Joi.valid('desc', 'asc'),
  search: Joi.string(),
});
