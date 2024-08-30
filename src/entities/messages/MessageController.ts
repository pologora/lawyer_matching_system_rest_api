// import { HTTP_STATUS_CODES } from '../../config/statusCodes';
import { BaseController } from '../../core/BaseController';
import { buildGetManyMessagesQuery } from './helpers/buildGetManyMessagesQuery';
import { Message } from './Message';
import { getMessageQuery } from './sqlQueries';

export class MessageController extends BaseController {
  constructor() {
    super({
      buildGetManyQuery: buildGetManyMessagesQuery,
      getOneQuery: getMessageQuery,
      model: Message,
      tableName: 'Message',
    });
  }
}
