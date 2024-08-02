export interface CreateLawyerDto {
  userId: number;
  experience: number;
  licenseNumber: string;
  bio: string;
  firstName: string;
  lastName: string;
  cityId: number;
  regionId: number;
  specializations: number[];
}
