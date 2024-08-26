import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  CreateLawyerController,
  GetLawyerController,
  GetManyLawyersController,
  RemoveLawyerController,
  UpdateLawyerController,
} from './types/lawyersTypes';

export const createLawyerController: CreateLawyerController =
  ({ createLawyerService }) =>
  async (req, res, _next) => {
    const lawyer = await createLawyerService({ data: req.body });

    return res.status(HTTP_STATUS_CODES.CREATED_201).json({
      status: 'success',
      message: 'Successfully created lawyer profile',
      data: lawyer,
    });
  };

export const getLawyerController: GetLawyerController =
  ({ LawyersProfile }) =>
  async (req, res, _next) => {
    const lawyer = await LawyersProfile.getOne({ id: Number(req.params.id) });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Lawyer profile retrieved successfully', data: lawyer });
  };

export const getManyLawyersController: GetManyLawyersController =
  ({ LawyersProfile, buildGetManyLawyersQuery }) =>
  async (req, res, _next) => {
    const { query, values } = buildGetManyLawyersQuery(req.query);

    const lawyers = await LawyersProfile.getMany({ query, values });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Lawyer profiles retrieved successfully', data: lawyers });
  };

export const updateLawyerController: UpdateLawyerController =
  ({ updateLawyerService }) =>
  async (req, res, _next) => {
    const updatedLawyer = await updateLawyerService({
      data: req.body,
      id: Number(req.params.id),
    });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Successfully updated lawyer profile', data: updatedLawyer });
  };

export const removeLawyerController: RemoveLawyerController =
  ({ LawyersProfile }) =>
  async (req: Request, res: Response, _next: NextFunction) => {
    await LawyersProfile.remove({ id: Number(req.params.id) });

    return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  };
