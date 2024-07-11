export interface UpdateUserDto {
  email?: string;
  password?: string;
}

export type UpdateUserKey = keyof UpdateUserDto;
