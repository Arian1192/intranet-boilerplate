import type { Dashboard, User, UserSession } from '@/types';
import type { Repository } from '../types';

export class SupabaseAdapter implements Repository {
  async login(_email: string, _password: string): Promise<UserSession> {
    throw new Error('SupabaseAdapter not implemented in Fase 1');
  }

  async getCurrentUser(): Promise<User | null> {
    throw new Error('SupabaseAdapter not implemented in Fase 1');
  }

  async logout(): Promise<void> {
    throw new Error('SupabaseAdapter not implemented in Fase 1');
  }

  async getDashboard(): Promise<Dashboard> {
    throw new Error('SupabaseAdapter not implemented in Fase 1');
  }
}
