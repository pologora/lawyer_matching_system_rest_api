export interface UpdateLawyerDto {
  experience?: number;
  license_number?: string;
  bio?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  region?: string;
  specializations?: number[];
}
