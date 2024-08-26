import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  CreateCaseController,
  GetCaseController,
  GetManyCaseController,
  RemoveCaseController,
  UpdateCaseController,
} from './types/casesTypes';

export const createCaseController: CreateCaseController =
  ({ Case, buildCreateTableRowQuery, getOneCaseQuery }) =>
  async (req, res, _next) => {
    const { query, values } = buildCreateTableRowQuery(req.body, 'Case');

    const caseId = await Case.create({ query, values });

    const newCase = await Case.getOne({ id: caseId, query: getOneCaseQuery });

    return res.status(HTTP_STATUS_CODES.CREATED_201).json({
      status: 'success',
      message: 'Successfully created new case',
      data: newCase,
    });
  };

export const getCaseController: GetCaseController =
  ({ Case, query }) =>
  async (req, res, _next) => {
    const oneCase = await Case.getOne({ id: Number(req.params.id), query });

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
  ({ Case, buildUpdateTableRowQuery, getOneCaseQuery }) =>
  async (req, res, _next) => {
    const id = Number(req.params.id);
    const { query, values } = buildUpdateTableRowQuery(req.body, 'Case');

    await Case.update({
      query,
      values,
      id,
    });

    const updatedCase = await Case.getOne({ id, query: getOneCaseQuery });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      status: 'success',
      message: 'Case updated successfully',
      data: updatedCase,
    });
  };

export const removeCaseController: RemoveCaseController =
  ({ Case, query }) =>
  async (req, res, _next) => {
    await Case.remove({ id: Number(req.params.id), query });

    return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  };
