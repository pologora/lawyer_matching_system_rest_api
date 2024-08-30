import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { UserModel } from '../../users/types/userTypes';
import { BuildInsertQuery, BuildUpdateQuery } from '../../../types/utils';
import { CRUDModel } from '../../../core/types/CRUDModelTypes';

type GetManyLawyersQueryParams = {
  limit?: number;
  page?: number;
  experienceMin?: number;
  experienceMax?: number;
  cityId?: number;
  regionId?: number;
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

export interface LawyerProfileModel extends CRUDModel {
  create(props: CreateLawyerProps): Promise<number>;
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
  LawyersProfile: LawyerProfileModel;
  getLawyerByIdQuery: string;
  deleteLawyerSpecializationsQuery: string;
  createLawyerSpecializationsQuery: string;
  buildUpdateQuery: BuildUpdateQuery;
  data: UpdateLawyerDto;
  id: number;
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
  LawyersProfile: LawyerProfileModel;
  User: UserModel;
  getLawyerByIdQuery: string;
  createLawyerSpecializationsQuery: string;
  updateUserRoleQuery: string;
  buildInsertQuery: BuildInsertQuery;
  data: CreateLawyerDto;
};

export type CreateLawyerService = (props: CreateLawyerServiceProps) => Promise<RowDataPacket>;

export type UpdateLawyerService = (props: UpdateLawyerServiceProps) => Promise<RowDataPacket>;
