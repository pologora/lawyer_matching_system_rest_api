import { buildCreateTableRowQuery } from '../../helpers/buildCreateTableRowQuery';
import { buildUpdateTableRowQuery } from '../../helpers/buildUpdateTableRowQuery';
import { Case } from './cases.model';
import { CreateCaseDto, UpdateCaseDto } from './dto';

type CreateCaseServiceProps = {
  data: CreateCaseDto;
};

type GetCaseServiceProps = {
  id: number;
};

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

export const getManyCasesService = async () => {
  return await Case.getMany();
};

export const updateCaseService = async ({ data, id }: UpdateCaseServiceProps) => {
  const { query: updateCaseQuery, values } = buildUpdateTableRowQuery(data, 'Case');

  await Case.update({ updateCaseQuery, values, id });

  return await Case.getOne({ id });
};

export const removeCaseService = async ({ id }: RemoveCaseServiceProps) => {
  return await Case.remove({ id });
};
