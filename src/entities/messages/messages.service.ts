import { buildCreateTableRowQuery } from '../../utils/buildCreateTableRowQuery';
import { buildUpdateTableRowQuery } from '../../utils/buildUpdateTableRowQuery';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { buildGetManyMessagesQuery } from './helpers/buildGetManyMessagesQuery';
import { Message } from './messages.model';

type CreateMessageServiceProps = {
  data: CreateMessageDto;
};

type GetMessageServiceProps = {
  id: number;
};

type GetManyMessagesServiceProps = {
  queryString: object;
};

type UpdateMessageServiceProps = {
  data: UpdateMessageDto;
  id: number;
};

type RemoveMessageServiceProps = {
  id: number;
};

export const createMessageService = async ({ data }: CreateMessageServiceProps) => {
  const { query: createMessageQuery, values } = buildCreateTableRowQuery(data, 'Message');

  const caseId = await Message.create({ createMessageQuery, values });

  return await Message.getOne({ id: caseId });
};

export const getMessageService = async ({ id }: GetMessageServiceProps) => {
  return await Message.getOne({ id });
};

export const getManyMessagesService = async ({ queryString }: GetManyMessagesServiceProps) => {
  const { query, values } = buildGetManyMessagesQuery(queryString);
  return await Message.getMany({ query, values });
};

export const updateMessageService = async ({ data, id }: UpdateMessageServiceProps) => {
  const { query: updateMessageQuery, values } = buildUpdateTableRowQuery(data, 'Message');

  await Message.update({ id, updateMessageQuery, values });

  return await Message.getOne({ id });
};

export const removeMessageService = async ({ id }: RemoveMessageServiceProps) => {
  return await Message.remove({ id });
};
