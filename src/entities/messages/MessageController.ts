// import { HTTP_STATUS_CODES } from '../../config/statusCodes';
import { BaseController } from '../../core/BaseController';
import { BuildGetManyMessagesQuery, MessagesModule } from './types/messagesTypes';

type MessageControllerConstructorProps = {
  buildGetManyMessagesQuery: BuildGetManyMessagesQuery;
  getMessageQuery: string;
  Message: MessagesModule;
};

export class MessageController extends BaseController {
  constructor({ buildGetManyMessagesQuery, getMessageQuery, Message }: MessageControllerConstructorProps) {
    super({
      buildGetManyQuery: buildGetManyMessagesQuery,
      getOneQuery: getMessageQuery,
      model: Message,
      tableName: 'Message',
    });
  }
}
