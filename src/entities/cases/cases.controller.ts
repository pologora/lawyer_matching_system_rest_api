import { NextFunction, Request, Response } from 'express';

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
  const newCase = await createCaseService({ data: req.body });

  res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'Successfully created new case',
    data: newCase,
  });
};

export const getCaseController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  const oneCase = await getCaseService({ id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Case retrieved successfully', data: oneCase });
};

export const getManyCasesController = async (req: Request, res: Response, _next: NextFunction) => {
  const cases = await getManyCasesService(req.query);

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Cases retrieved successfully', data: cases });
};

export const updateCaseController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  const updatedCase = await updateCaseService({ data: req.body, id });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Case updated successfully',
    data: updatedCase,
  });
};

export const removeCaseController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  await removeCaseService({ id });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
