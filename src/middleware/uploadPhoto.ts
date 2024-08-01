import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { IUser } from '../types/user';
import { AppError } from '../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../utils/statusCodes';

const multerStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/img/users');
  },
  filename(req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const user = req.user as IUser;
    cb(null, `user-${user.userId}.${ext}`);
  },
});

const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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
