import { NextFunction, Response, Request } from 'express';
import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2';
import { UserModel } from '../../users/types/userTypes';
import { BuildCreateTableRowQuery, BuildUpdateTableRowQuery } from '../../../types/utils';

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

export type CreateProps = {
  query: string;
  values: (string | number)[];
  specializations: number[];
};

export type GetOneProps = {
  id: number;
};

export type GetOneByUserIdProps = {
  userId: number;
};

export type GetManyProps = {
  query: string;
  values: (string | number)[];
};

export type UpdateProps = {
  query: string;
  values: (string | number)[];
  id: number;
};

export type UpdateRatingProps = {
  id: number;
};

export type UpdateLawyerSpecializationsProps = {
  lawyerId: number;
  specializationsIds: number[];
};

export type RemoveProps = {
  id: number;
};

export interface LawyersProfileModel {
  create(props: CreateProps): Promise<number | undefined>;
  getOne(props: GetOneProps): Promise<RowDataPacket>;
  getOneByUserId(props: GetOneByUserIdProps): Promise<RowDataPacket>;
  getMany(props: GetManyProps): Promise<QueryResult>;
  update(props: UpdateProps): Promise<ResultSetHeader>;
  updateRating(props: UpdateRatingProps): Promise<ResultSetHeader>;
  updateLawyerSpecializations(props: UpdateLawyerSpecializationsProps): Promise<void>;
  remove(props: RemoveProps): Promise<ResultSetHeader>;
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

type UpdateLawerServiceProps = {
  LawyersProfile: LawyersProfileModel;
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
  buildCreateTableRowQuery: BuildCreateTableRowQuery;
};

export type CreateLawyerService = (
  props: CreateLawyerServiceProps,
) => (args: { data: CreateLawyerDto }) => Promise<RowDataPacket>;

export type UpdateLawyerService = (
  props: UpdateLawerServiceProps,
) => (args: { data: UpdateLawyerDto; id: number }) => Promise<RowDataPacket>;

export type CreateLawyerController = (props: {
  createLawyerService: (args: { data: CreateLawyerDto }) => Promise<RowDataPacket>;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export type GetLawyerController = (props: {
  LawyersProfile: LawyersProfileModel;
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
}) => (req: Request, res: Response, _next: NextFunction) => Promise<Response>;
