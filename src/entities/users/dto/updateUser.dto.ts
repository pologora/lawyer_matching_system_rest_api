export interface UpdateUser {
  email?: string;
  password?: string;
}

export type UpdateUserKey = keyof UpdateUser;
