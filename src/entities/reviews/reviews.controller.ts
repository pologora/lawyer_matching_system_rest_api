import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
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
  ({ Review }) =>
  async (req, res, _next) => {
    const review = await Review.getOne({ id: Number(req.params.id) });

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
  ({ Review, buildUpdateTableRowQuery }) =>
  async (req, res, _next) => {
    const id = Number(req.params.id);

    const { query: updateMessageQuery, values } = buildUpdateTableRowQuery(req.body, 'Review');

    await Review.update({ id, updateMessageQuery, values });

    const updatedReview = await Review.getOne({ id });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Review updated successfully', data: updatedReview });
  };

export const removeReviewController: RemoveReviewController =
  ({ Review }) =>
  async (req, res, _next) => {
    await Review.remove({ id: Number(req.params.id) });

    return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  };
