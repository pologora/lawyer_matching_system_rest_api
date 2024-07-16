import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { lawyerCreateSchema } from './lawyers.validation';
import { AppError } from '../../utils/errors/AppError';
import { createLawyerService } from './lawyers.service';

export const getManyLawyersController = async (req: Request, res: Response, next: NextFunction) => {
  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Lawyers retrieved successfully' });
};

export const getLawyerController = async (req: Request, res: Response, next: NextFunction) => {
  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Lawyer retrieved successfully' });
};

export const createLawyerController = async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = lawyerCreateSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const lawyer = await createLawyerService(value);

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Successfully created lawyer profile',
    data: lawyer,
  });
};

export const updateLawyerController = async (req: Request, res: Response, next: NextFunction) => {
  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Successfully updated lawyer profile' });
};

export const removeLawyerController = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).json({});
};
