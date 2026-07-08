import type { Dashboard, User, UserSession } from '@/types';

export interface Repository {
  login(email: string, password: string): Promise<UserSession>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
  getDashboard(): Promise<Dashboard>;
}
