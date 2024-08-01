import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { IUser } from '../types/user';

export const resizeUserPhoto = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const user = req.user as IUser;

  req.file.filename = `user-${user.userId}.jpeg`;

  const imageWidthPixel = 250;
  sharp(req.file.buffer)
    .resize(imageWidthPixel, imageWidthPixel)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};
