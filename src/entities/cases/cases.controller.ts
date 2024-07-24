import { NextFunction, Request, Response } from 'express';

import { createCaseSchema, updateCaseSchema } from './cases.validation';
import { AppError } from '../../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  createCaseService,
  getCaseService,
  getManyCasesService,
  removeCaseService,
  updateCaseService,
} from './cases.service';
import { validateId } from '../../utils/validateId';

export const createCaseController = async (req: Request, res: Response, _next: NextFunction) => {
  const { error, value } = createCaseSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const newCase = await createCaseService({ data: value });

  res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'Successfully created new case',
    data: newCase,
  });
};

export const getCaseController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const oneCase = await getCaseService({ id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Case retrieved successfully', data: oneCase });
};

export const getManyCasesController = async (req: Request, res: Response, _next: NextFunction) => {
  const cases = await getManyCasesService();

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Cases retrieved successfully', data: cases });
};

export const updateCaseController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const { error, value } = updateCaseSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const updatedCase = await updateCaseService({ data: value, id });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Case updated successfully',
    data: updatedCase,
  });
};

export const removeCaseController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  await removeCaseService({ id });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
