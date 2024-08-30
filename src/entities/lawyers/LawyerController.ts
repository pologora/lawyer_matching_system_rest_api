import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../core/BaseController';
import { buildGetManyLawyersQuery } from './helpers/biuldGetManyLawyersQuery';
import { LawyerProfile } from './LawyerProfile';
import { getLawyerByIdQuery } from './sqlQueries';
import { CreateLawyerService, LawyerProfileModel, UpdateLawyerService } from './types/lawyersTypes';
import { UserModel } from '../users/types/userTypes';

type LawyerControllerConstructorProps = {
  createLawyerService: CreateLawyerService;
  updateLawyerService: UpdateLawyerService;
  deleteLawyerSpecializationsQuery: string;
  createLawyerSpecializationsQuery: string;
  updateUserRoleQuery: string;
  User: UserModel;
};

export class LawyerController extends BaseController {
  createLawyerService;
  updateLawyerService;
  createLawyerSpecializationsQuery;
  deleteLawyerSpecializationsQuery;
  updateUserRoleQuery;
  User;

  constructor({
    createLawyerService,
    updateLawyerService,
    createLawyerSpecializationsQuery,
    deleteLawyerSpecializationsQuery,
    updateUserRoleQuery,
    User,
  }: LawyerControllerConstructorProps) {
    super({
      buildGetManyQuery: buildGetManyLawyersQuery,
      getOneQuery: getLawyerByIdQuery,
      model: LawyerProfile,
      tableName: 'LawyerProfile',
    });

    this.createLawyerService = createLawyerService;
    this.updateLawyerService = updateLawyerService;
    this.createLawyerSpecializationsQuery = createLawyerSpecializationsQuery;
    this.deleteLawyerSpecializationsQuery = deleteLawyerSpecializationsQuery;
    this.updateUserRoleQuery = updateUserRoleQuery;
    this.User = User;
  }

  async create(req: Request, res: Response, _next: NextFunction) {
    const lawyer = await this.createLawyerService({
      LawyersProfile: this.model as LawyerProfileModel,
      User: this.User,
      buildInsertQuery: this.buildInsertQuery,
      createLawyerSpecializationsQuery: this.createLawyerSpecializationsQuery,
      data: req.body,
      getLawyerByIdQuery,
      updateUserRoleQuery: this.updateUserRoleQuery,
    });

    return res.status(this.HTTP_STATUS_CODES.CREATED_201).json({
      data: lawyer,
      message: 'Successfully created lawyer profile',
      status: 'success',
    });
  }

  async update(req: Request, res: Response, _next: NextFunction) {
    const updatedLawyer = await this.updateLawyerService({
      LawyersProfile: this.model as LawyerProfileModel,
      buildUpdateQuery: this.buildUpdateQuery,
      createLawyerSpecializationsQuery: this.createLawyerSpecializationsQuery,
      data: req.body,
      deleteLawyerSpecializationsQuery: this.deleteLawyerSpecializationsQuery,
      getLawyerByIdQuery: this.getOneQuery,
      id: Number(req.params.id),
    });

    return res.status(this.HTTP_STATUS_CODES.SUCCESS_200).json({
      data: updatedLawyer,
      message: 'Successfully updated lawyer profile',
      status: 'success',
    });
  }
}
