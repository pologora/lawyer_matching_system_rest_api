import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  createLawyerService,
  getLawyerService,
  getManyLawyersService,
  removeLawyerService,
  updateLawyerService,
} from './lawyers.service';

export const createLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const lawyer = await createLawyerService({ data: req.body });

  return res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'Successfully created lawyer profile',
    data: lawyer,
  });
};

export const getLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const lawyer = await getLawyerService({ id: Number(req.params.id) });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Lawyer profile retrieved successfully', data: lawyer });
};

export const getManyLawyersController = async (req: Request, res: Response, _next: NextFunction) => {
  const lawyers = await getManyLawyersService({ queryString: req.query });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Lawyer profiles retrieved successfully', data: lawyers });
};

export const updateLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const updatedLawyer = await updateLawyerService({ data: req.body, id: Number(req.params.id) });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Successfully updated lawyer profile', data: updatedLawyer });
};

export const removeLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  await removeLawyerService({ id: Number(req.params.id) });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
