import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../core/BaseController';
import { BuildGetManyReviewsQuery, CreateReviewService, ReviewModel } from './types/reviewsTypes';
import { LawyerModel } from '../lawyers/types/lawyersTypes';

type ReviewControllerContructorProps = {
  createReviewService: CreateReviewService;
  Lawyer: LawyerModel;
  Review: ReviewModel;
  updateRatingQuery: string;
  getReviewQuery: string;
  buildGetManyReviewsQuery: BuildGetManyReviewsQuery;
};

export class ReviewController extends BaseController {
  createReviewService;
  Lawyer;
  updateRatingQuery;

  constructor({
    createReviewService,
    Lawyer,
    updateRatingQuery,
    buildGetManyReviewsQuery,
    getReviewQuery,
    Review,
  }: ReviewControllerContructorProps) {
    super({
      buildGetManyQuery: buildGetManyReviewsQuery,
      getOneQuery: getReviewQuery,
      model: Review,
      tableName: 'Review',
    });

    this.createReviewService = createReviewService;
    this.updateRatingQuery = updateRatingQuery;
    this.Lawyer = Lawyer;
  }

  async create(req: Request, res: Response, _next: NextFunction) {
    const review = await this.createReviewService({
      Lawyer: this.Lawyer,
      Review: this.model,
      buildInsertQuery: this.buildInsertQuery,
      data: req.body,
      getReviewQuery: this.getOneQuery,
      updateRatingQuery: this.updateRatingQuery,
    });

    return res.status(this.HTTP_STATUS_CODES.CREATED_201).json({
      data: review,
      message: 'Successfully created new review',
      status: 'success',
    });
  }
}
