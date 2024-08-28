import { HTTP_STATUS_CODES } from '../../config/statusCodes';
import {
  CreateReviewController,
  GetManyReviewsController,
  GetReviewController,
  RemoveReviewController,
  UpdateReviewController,
} from './types/reviewsTypes';

export const createReviewController: CreateReviewController =
  ({ createReviewService }) =>
  async (req, res, _next) => {
    const review = await createReviewService({ data: req.body });

    return res.status(HTTP_STATUS_CODES.CREATED_201).json({
      status: 'success',
      message: 'Successfully created new review',
      data: review,
    });
  };

export const getReviewController: GetReviewController =
  ({ Review, query }) =>
  async (req, res, _next) => {
    const review = await Review.getOne({ id: Number(req.params.id), query });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Review retrieved successfully', data: review });
  };

export const getManyReviewsController: GetManyReviewsController =
  ({ Review, buildGetManyReviewsQuery }) =>
  async (req, res, _next) => {
    const { query, values } = buildGetManyReviewsQuery(req.query);

    const reviews = await Review.getMany({ query, values });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Reviews retrieved successfully', data: reviews });
  };

export const updateReviewController: UpdateReviewController =
  ({ Review, buildUpdateTableRowQuery, getReviewQuery }) =>
  async (req, res, _next) => {
    const id = Number(req.params.id);

    const { query, values } = buildUpdateTableRowQuery(req.body, 'Review');

    await Review.update({ id, query, values });

    const updatedReview = await Review.getOne({ id, query: getReviewQuery });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Review updated successfully', data: updatedReview });
  };

export const removeReviewController: RemoveReviewController =
  ({ Review, buildRemoveQuery }) =>
  async (req, res, _next) => {
    await Review.remove({ id: Number(req.params.id), query: buildRemoveQuery('Review') });

    return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  };
