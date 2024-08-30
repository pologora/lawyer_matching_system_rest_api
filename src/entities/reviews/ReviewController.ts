import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../core/BaseController';
import { buildGetManyReviewsQuery } from './helpers/buildGetManyReviewsQuery';
import { Review } from './Review';
import { getReviewQuery } from './sqlQueries';
import { CreateReviewService } from './types/reviewsTypes';
import { LawyerProfileModel } from '../lawyers/types/lawyersTypes';

type ReviewControllerContructorProps = {
  createReviewService: CreateReviewService;
  LawyerProfile: LawyerProfileModel;
};

export class ReviewController extends BaseController {
  createReviewService: CreateReviewService;
  LawyersProfile: LawyerProfileModel;
  constructor({ createReviewService, LawyerProfile }: ReviewControllerContructorProps) {
    super({
      buildGetManyQuery: buildGetManyReviewsQuery,
      getOneQuery: getReviewQuery,
      model: Review,
      tableName: 'Review',
    });

    this.createReviewService = createReviewService;
    this.LawyersProfile = LawyerProfile;
  }

  async create(req: Request, res: Response, _next: NextFunction) {
    const review = await this.createReviewService({
      LawyersProfile: this.LawyersProfile,
      Review: this.model,
      buildInsertQuery: this.buildInsertQuery,
      data: req.body,
      getReviewQuery,
    });

    return res.status(this.HTTP_STATUS_CODES.CREATED_201).json({
      data: review,
      message: 'Successfully created new review',
      status: 'success',
    });
  }
}
