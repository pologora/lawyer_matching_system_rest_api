export interface IUser {
  id: number;
  email: string;
  role: string;
  password_changed_at: Date | null;
}
