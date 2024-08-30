import { NextFunction, Request, Response } from 'express';

import { BaseController } from '../../core/BaseController';
import { HashPassword } from '../../types/utils';
import { BuildGetManyUsersQuery, UserModel } from './types/userTypes';

type UserControllerConstructorProps = {
  hashPassword: HashPassword;
  buildGetManyUsersQuery: BuildGetManyUsersQuery;
  getUserByIdQuery: string;
  User: UserModel;
};

export class UserController extends BaseController {
  hashPassword: HashPassword;
  constructor({ hashPassword, buildGetManyUsersQuery, getUserByIdQuery, User }: UserControllerConstructorProps) {
    super({
      buildGetManyQuery: buildGetManyUsersQuery,
      getOneQuery: getUserByIdQuery,
      model: User,
      tableName: 'User',
    });

    this.hashPassword = hashPassword;
  }

  async create(req: Request, res: Response, _next: NextFunction) {
    const { email, password } = req.body;

    const hashedPassword = await this.hashPassword(password);

    const { query, values } = this.buildInsertQuery({ email, password: hashedPassword }, this.tableName);

    const result = await this.model.create({ query, values });

    return res.status(this.HTTP_STATUS_CODES.CREATED_201).json({
      data: result,
      message: 'User created successfully.',
      status: 'success',
    });
  }

  async uploadPhoto(req: Request, res: Response, _next: NextFunction) {
    if (!req.file) {
      throw new this.AppError('No file uploaded. Please upload an image file', this.HTTP_STATUS_CODES.BAD_REQUEST_400);
    }

    const id = Number(req.params.id);
    const { query, values } = this.buildUpdateQuery({ profileImageFileName: req.file.filename }, 'User');

    await this.model.update({ id, query, values });

    return res.status(this.HTTP_STATUS_CODES.SUCCESS_200).json({
      message: 'User image uploaded successfully',
      status: 'success',
    });
  }
}
