export interface UpdateUser {
  username?: string;
  email?: string;
  password?: string;
}

export type UpdateUserKey = keyof UpdateUser;
