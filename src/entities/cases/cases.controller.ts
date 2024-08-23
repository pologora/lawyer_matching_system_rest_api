import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { getCaseService, getManyCasesService, removeCaseService, updateCaseService } from './cases.service';
import { CreateCaseController } from './types/casesTypes';

export const createCaseController: CreateCaseController =
  (Case, buildCreateTableRowQuery) => async (req, res, _next) => {
    const data = req.body;

    const { query: createCaseQuery, values } = buildCreateTableRowQuery(data, 'Case');

    const caseId = await Case.create({ createCaseQuery, values });

    const newCase = await Case.getOne({ id: caseId });

    res.status(HTTP_STATUS_CODES.CREATED_201).json({
      status: 'success',
      message: 'Successfully created new case',
      data: newCase,
    });
  };

export const getCaseController = async (req: Request, res: Response, _next: NextFunction) => {
  const oneCase = await getCaseService({ id: Number(req.params.id) });

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
  const updatedCase = await updateCaseService({ data: req.body, id: Number(req.params.id) });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Case updated successfully',
    data: updatedCase,
  });
};

export const removeCaseController = async (req: Request, res: Response, _next: NextFunction) => {
  await removeCaseService({ id: Number(req.params.id) });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
