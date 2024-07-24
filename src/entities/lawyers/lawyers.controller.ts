import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { getManyLawyersQuerySchema, lawyerCreateSchema, lawyerUpdateSchema } from './lawyers.validation';
import { AppError } from '../../utils/errors/AppError';
import {
  createLawyerService,
  getLawyerService,
  getManyLawyersService,
  removeLawyerService,
  updateLawyerService,
} from './lawyers.service';
import { validateId } from '../../utils/validateId';

export const createLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const { error, value } = lawyerCreateSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const lawyer = await createLawyerService({ data: value });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Successfully created lawyer profile',
    data: lawyer,
  });
};

export const getLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const lawyer = await getLawyerService({ id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Lawyer profile retrieved successfully', data: lawyer });
};

export const getManyLawyersController = async (req: Request, res: Response, _next: NextFunction) => {
  const { query } = req;

  const { error, value } = getManyLawyersQuerySchema.validate(query);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const lawyers = await getManyLawyersService({ queryString: value });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Lawyer profiles retrieved successfully', data: lawyers });
};

export const updateLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const { error, value } = lawyerUpdateSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const updatedLawyer = await updateLawyerService({ data: value, id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Successfully updated lawyer profile', data: updatedLawyer });
};

export const removeLawyerController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  await removeLawyerService({ id });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
