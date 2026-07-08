export * from './types';
export * from './RepositoryContext';
export * from './RepositoryProvider';
export * from './useRepositoryQuery';
export { MockRepository } from './MockRepository';
export { SupabaseAdapter } from './adapters/SupabaseAdapter';
export { RestAdapter } from './adapters/RestAdapter';

import { MockRepository } from './MockRepository';
import { SupabaseAdapter } from './adapters/SupabaseAdapter';
import { RestAdapter } from './adapters/RestAdapter';
import type { Repository } from './types';

export function createRepository(adapter: string): Repository {
  switch (adapter) {
    case 'supabase':
      return new SupabaseAdapter();
    case 'rest':
      return new RestAdapter();
    case 'mock':
    default:
      return new MockRepository();
  }
}
