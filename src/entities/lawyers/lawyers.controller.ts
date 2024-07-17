import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { lawyerUpdateSchema } from './lawyers.validation';
import { AppError } from '../../utils/errors/AppError';
import {
  createLawyerService,
  getLawyerService,
  getManyLawyersService,
  removeLawyerService,
  updateLawyerService,
} from './lawyers.service';
import { validateId } from '../../utils/validateId';

export const getManyLawyersController = async (_req: Request, res: Response, _next: NextFunction) => {
  const lawyers = await getManyLawyersService();

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Lawyers retrieved successfully', data: lawyers });
};

export const getLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const lawyer = await getLawyerService(id);

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Lawyer retrieved successfully', data: lawyer });
};

export const createLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const { error, value } = lawyerUpdateSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const lawyer = await createLawyerService(value);

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Successfully created lawyer profile',
    data: lawyer,
  });
};

export const updateLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const { error, value } = lawyerUpdateSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const updatedLawyer = await updateLawyerService(value, id);

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Successfully updated lawyer profile', data: updatedLawyer });
};

export const removeLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  await removeLawyerService(id);

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
