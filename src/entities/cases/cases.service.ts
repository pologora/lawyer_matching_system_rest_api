import { buildCreateTableRowQuery } from '../../helpers/buildCreateTableRowQuery';
import { buildUpdateTableRowQuery } from '../../helpers/buildUpdateTableRowQuery';
import { Case } from './cases.model';
import { CreateCaseDto, UpdateCaseDto } from './dto';

type CreateCaseServiceParams = {
  data: CreateCaseDto;
};

type GetCaseServiceParams = {
  id: number;
};

type UpdateCaseServiceParams = {
  data: UpdateCaseDto;
  id: number;
};

type RemoveCaseServiceParams = {
  id: number;
};

export const createCaseService = async ({ data }: CreateCaseServiceParams) => {
  const { query: createCaseQuery, values } = buildCreateTableRowQuery(data, 'Case');

  const caseId = await Case.create({ createCaseQuery, values });

  return await Case.getOne({ id: caseId });
};

export const getCaseService = async ({ id }: GetCaseServiceParams) => {
  return await Case.getOne({ id });
};

export const getManyCasesService = async () => {
  return await Case.getMany();
};

export const updateCaseService = async ({ data, id }: UpdateCaseServiceParams) => {
  const { query: updateCaseQuery, values } = buildUpdateTableRowQuery(data, 'Case');

  await Case.update({ updateCaseQuery, values, id });

  return await Case.getOne({ id });
};

export const removeCaseService = async ({ id }: RemoveCaseServiceParams) => {
  return await Case.remove({ id });
};
