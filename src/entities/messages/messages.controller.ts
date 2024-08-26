import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  CreateMessageController,
  GetManyMessagesController,
  GetMessageController,
  RemoveMessageController,
  UpdateMessageController,
} from './types/messagesTypes';

export const createMessageController: CreateMessageController =
  ({ buildCreateTableRowQuery, getMessageQuery, Message }) =>
  async (req, res, _next) => {
    const { query, values } = buildCreateTableRowQuery(req.body, 'Message');

    const messageId = await Message.create({ query, values });

    const message = await Message.getOne({ id: messageId, query: getMessageQuery });

    return res.status(HTTP_STATUS_CODES.CREATED_201).json({
      status: 'success',
      message: 'Successfully created message',
      data: message,
    });
  };

export const getMessageController: GetMessageController =
  ({ Message, query }) =>
  async (req, res, _next) => {
    const message = await Message.getOne({ id: Number(req.params.id), query });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Message retrieved successfully', data: message });
  };

export const getManyMessagesController: GetManyMessagesController =
  ({ Message, buildGetManyMessagesQuery }) =>
  async (req, res, _next) => {
    const { query, values } = buildGetManyMessagesQuery(req.query);

    const messages = await Message.getMany({ query, values });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Messages retrieved successfully', data: messages });
  };

export const updateMessageController: UpdateMessageController =
  ({ Message, buildUpdateTableRowQuery, getMessageQuery }) =>
  async (req, res, _next) => {
    const id = Number(req.params.id);

    const { query, values } = buildUpdateTableRowQuery(req.body, 'Message');

    await Message.update({ id, query, values });

    const updatedMessage = await Message.getOne({ id, query: getMessageQuery });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Successfully updated message', data: updatedMessage });
  };

export const removeMessageController: RemoveMessageController =
  ({ Message, query }) =>
  async (req, res, _next) => {
    await Message.remove({ id: Number(req.params.id), query });

    return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  };
