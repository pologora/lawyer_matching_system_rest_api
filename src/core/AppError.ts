import { HTTP_STATUS_CODES, StatusCodes } from '../config/statusCodes';

export class AppError extends Error {
  statusCode: StatusCodes;
  status: string;
  isOperational: boolean;
  sqlMessage: string;
  errno: number | null;
  toLog: boolean;

  constructor(message: string, code: StatusCodes = HTTP_STATUS_CODES.BAD_REQUEST_400, toLog = false) {
    super(message);

    this.statusCode = code;
    this.status = 'error';
    this.isOperational = true;
    this.sqlMessage = '';
    this.errno = null;
    this.toLog = toLog;
  }
}
