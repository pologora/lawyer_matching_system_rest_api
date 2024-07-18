export interface CreateLawyerDto {
  userId: number;
  experience: number;
  licenseNumber: string;
  bio: string;
  firstName: string;
  lastName: string;
  city: string;
  region: string;
  specializations: number[];
}
