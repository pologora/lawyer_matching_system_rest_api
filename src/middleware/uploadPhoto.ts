import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { AppError } from '../core/AppError';
import { HTTP_STATUS_CODES } from '../config/statusCodes';

const multerStorage = multer.memoryStorage();

const multerFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', HTTP_STATUS_CODES.BAD_REQUEST_400));
  }
};

const upload = multer({
  fileFilter: multerFilter,
  storage: multerStorage,
});

export const uploadPhoto = () => upload.single('photo');
