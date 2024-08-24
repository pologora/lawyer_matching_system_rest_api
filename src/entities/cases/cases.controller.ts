import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  CreateCaseController,
  GetCaseController,
  GetManyCaseController,
  RemoveCaseController,
  UpdateCaseController,
} from './types/casesTypes';

export const createCaseController: CreateCaseController =
  ({ Case, buildCreateTableRowQuery, checkDatabaseOperation }) =>
  async (req, res, _next) => {
    const { query: createCaseQuery, values } = buildCreateTableRowQuery(req.body, 'Case');

    const caseId = await Case.create({ createCaseQuery, values, checkDatabaseOperation });

    const newCase = await Case.getOne({ id: caseId, checkDatabaseOperation });

    return res.status(HTTP_STATUS_CODES.CREATED_201).json({
      status: 'success',
      message: 'Successfully created new case',
      data: newCase,
    });
  };

export const getCaseController: GetCaseController =
  ({ Case, checkDatabaseOperation }) =>
  async (req, res, _next) => {
    const oneCase = await Case.getOne({ id: Number(req.params.id), checkDatabaseOperation });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Case retrieved successfully', data: oneCase });
  };

export const getManyCasesController: GetManyCaseController =
  ({ Case, buildGetManyCasesQuery }) =>
  async (req, res, _next) => {
    const { query, values } = buildGetManyCasesQuery(req.query);

    const cases = await Case.getMany({ query, values });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Cases retrieved successfully', data: cases });
  };

export const updateCaseController: UpdateCaseController =
  ({ Case, buildUpdateTableRowQuery, checkDatabaseOperation }) =>
  async (req, res, _next) => {
    const { query: updateCaseQuery, values } = buildUpdateTableRowQuery(req.body, 'Case');

    const updatedCase = await Case.update({
      updateCaseQuery,
      values,
      id: Number(req.params.id),
      checkDatabaseOperation,
    });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      status: 'success',
      message: 'Case updated successfully',
      data: updatedCase,
    });
  };

export const removeCaseController: RemoveCaseController =
  ({ Case, checkDatabaseOperation }) =>
  async (req, res, _next) => {
    await Case.remove({ id: Number(req.params.id), checkDatabaseOperation });

    return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  };
