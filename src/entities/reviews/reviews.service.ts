import { buildCreateTableRowQuery } from '../../utils/buildCreateTableRowQuery';
import { buildUpdateTableRowQuery } from '../../utils/buildUpdateTableRowQuery';
import { LawyersProfile } from '../lawyers/lawyers.model';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { buildGetManyReviewsQuery } from './helpers/buildGetManyReviewsQuery';
import { Review } from './reviews.model';

type CreateReviewServiceProps = {
  data: CreateReviewDto;
};

type GetReviewServiceProps = {
  id: number;
};

type GetManyReviewsServiceProps = {
  queryString: object;
};

type UpdateReviewServiceProps = {
  data: UpdateReviewDto;
  id: number;
};

type RemoveReviewServiceProps = {
  id: number;
};

export const createReviewService = async ({ data }: CreateReviewServiceProps) => {
  const { query: createMessageQuery, values } = buildCreateTableRowQuery(data, 'Review');

  const caseId = await Review.create({ createMessageQuery, values });

  await LawyersProfile.updateRating({ id: data.lawyerId });

  return await Review.getOne({ id: caseId });
};

export const getReviewService = async ({ id }: GetReviewServiceProps) => {
  return await Review.getOne({ id });
};

export const getManyReviewsService = async ({ queryString }: GetManyReviewsServiceProps) => {
  const { query, values } = buildGetManyReviewsQuery(queryString);
  return await Review.getMany({ query, values });
};

export const updateReviewService = async ({ data, id }: UpdateReviewServiceProps) => {
  const { query: updateMessageQuery, values } = buildUpdateTableRowQuery(data, 'Review');

  await Review.update({ id, updateMessageQuery, values });

  return await Review.getOne({ id });
};

export const removeReviewService = async ({ id }: RemoveReviewServiceProps) => {
  return await Review.remove({ id });
};
