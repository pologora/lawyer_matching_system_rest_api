import { buildCreateTableRowQuery } from '../../helpers/buildCreateTableRowQuery';
import { buildUpdateTableRowQuery } from '../../helpers/buildUpdateTableRowQuery';
import { Case } from './cases.model';
import { CreateCaseDto, GetManyCasesDto, UpdateCaseDto } from './dto';
import { buildGetManyCasesQuery } from './helpers/buildGetManyCasesQuery';

type CreateCaseServiceProps = {
  data: CreateCaseDto;
};

type GetCaseServiceProps = {
  id: number;
};

type GetManyCasesProps = GetManyCasesDto;

type UpdateCaseServiceProps = {
  data: UpdateCaseDto;
  id: number;
};

type RemoveCaseServiceProps = {
  id: number;
};

export const createCaseService = async ({ data }: CreateCaseServiceProps) => {
  const { query: createCaseQuery, values } = buildCreateTableRowQuery(data, 'Case');

  const caseId = await Case.create({ createCaseQuery, values });

  return await Case.getOne({ id: caseId });
};

export const getCaseService = async ({ id }: GetCaseServiceProps) => {
  return await Case.getOne({ id });
};

export const getManyCasesService = async (data: GetManyCasesProps) => {
  const { query, values } = buildGetManyCasesQuery(data);

  return await Case.getMany({ query, values });
};

export const updateCaseService = async ({ data, id }: UpdateCaseServiceProps) => {
  const { query: updateCaseQuery, values } = buildUpdateTableRowQuery(data, 'Case');

  await Case.update({ id, updateCaseQuery, values });

  return await Case.getOne({ id });
};

export const removeCaseService = async ({ id }: RemoveCaseServiceProps) => {
  return await Case.remove({ id });
};
