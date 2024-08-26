import { NextFunction, Response, Request } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { UserModel } from '../../users/types/userTypes';
import { BuildCreateTableRowQuery, BuildUpdateTableRowQuery } from '../../../types/utils';
import { CRUDModel } from '../../../types/CRUDModel';

type GetManyLawyersQueryParams = {
  limit?: number;
  page?: number;
  experienceMin?: number;
  experienceMax?: number;
  cityId?: string;
  regionId?: string;
  ratingMin?: number;
  ratingMax?: number;
  search?: string;
  sort?: string;
  order?: 'desc' | 'asc';
  specialization?: number;
  initialConsultationFeeMin?: number;
  initialConsultationFeeMax?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
};

export type BuildGetManyLawyersQuery = (params: GetManyLawyersQueryParams) => {
  query: string;
  values: (string | number)[];
};

export type CreateLawyerProps = {
  query: string;
  values: (string | number)[];
  specializations: number[];
  createLawyerSpecializationsQuery: string;
  getLawyerByIdQuery: string;
};

export type GetOneByUserIdProps = {
  userId: number;
  getLawyerByUserIdQuery: string;
};

export type UpdateRatingProps = {
  id: number;
  updateRatingQuery: string;
};

export type UpdateLawyerSpecializationsProps = {
  lawyerId: number;
  specializationsIds: number[];
  deleteLawyerSpecializationsQuery: string;
  createLawyerSpecializationsQuery: string;
};

export interface LawyersProfileModel extends CRUDModel {
  createLawyer(props: CreateLawyerProps): Promise<number>;
  getOneByUserId(props: GetOneByUserIdProps): Promise<RowDataPacket>;
  updateRating(props: UpdateRatingProps): Promise<ResultSetHeader>;
  updateLawyerSpecializations(props: UpdateLawyerSpecializationsProps): Promise<void>;
}

type UpdateLawyerDto = {
  experience?: number;
  licenseNumber?: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  region?: string;
  specializations?: number[];
  hourlyRate?: number;
  initialConsultationFee?: number;
};

type UpdateLawyerServiceProps = {
  LawyersProfile: LawyersProfileModel;
  getLawyerByIdQuery: string;
  deleteLawyerSpecializationsQuery: string;
  createLawyerSpecializationsQuery: string;
  buildUpdateTableRowQuery: BuildUpdateTableRowQuery;
};

type CreateLawyerDto = {
  userId: number;
  experience: number;
  licenseNumber: string;
  bio: string;
  firstName: string;
  lastName: string;
  cityId: number;
  regionId: number;
  specializations: number[];
  initialConsultationFee?: number;
  hourlyRate?: number;
};

export type CreateLawyerServiceProps = {
  LawyersProfile: LawyersProfileModel;
  User: UserModel;
  getLawyerByIdQuery: string;
  createLawyerSpecializationsQuery: string;
  updateUserRoleQuery: string;
  buildCreateTableRowQuery: BuildCreateTableRowQuery;
};

export type CreateLawyerService = (
  props: CreateLawyerServiceProps,
) => (args: { data: CreateLawyerDto }) => Promise<RowDataPacket>;

export type UpdateLawyerService = (
  props: UpdateLawyerServiceProps,
) => (args: { data: UpdateLawyerDto; id: number }) => Promise<RowDataPacket>;

export type CreateLawyerController = (props: {
  createLawyerService: (args: { data: CreateLawyerDto }) => Promise<RowDataPacket>;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type GetLawyerController = (props: {
  LawyersProfile: LawyersProfileModel;
  query: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type GetManyLawyersController = (props: {
  LawyersProfile: LawyersProfileModel;
  buildGetManyLawyersQuery: BuildGetManyLawyersQuery;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type UpdateLawyerController = (props: {
  updateLawyerService: (args: { data: UpdateLawyerDto; id: number }) => Promise<RowDataPacket>;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;

export type RemoveLawyerController = (props: {
  LawyersProfile: LawyersProfileModel;
  query: string;
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
