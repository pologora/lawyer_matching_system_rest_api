import Joi from 'joi';

export const createMessageSchema = Joi.object({
  message: Joi.string().required(),
  receiverId: Joi.number().required(),
  senderId: Joi.number().required(),
});

export const updateMessageSchema = Joi.object({
  message: Joi.string().required(),
});

const sortByValues = ['createdAt', 'updatedAt'];
export const getManyMessagesShema = Joi.object({
  endDate: Joi.date(),
  limit: Joi.number(),
  page: Joi.number(),
  receiverId: Joi.number(),
  search: Joi.string(),
  senderId: Joi.number(),
  sortBy: Joi.valid(...sortByValues),
  sortOrder: Joi.valid('desc', 'asc'),
  startDate: Joi.date(),
});
