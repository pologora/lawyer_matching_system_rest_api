import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { IUser } from '../types/IUser';

export const resizeUserPhoto = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const user = req.user as IUser;

  req.file.filename = `user-${user.userId}.jpeg`;

  const uploadPath = path.join(__dirname, '..', '..', 'public', 'img', 'users');

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const imageWidthPixel = 250;

  await sharp(req.file.buffer)
    .resize(imageWidthPixel, imageWidthPixel)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(uploadPath, req.file.filename));

  next();
};
