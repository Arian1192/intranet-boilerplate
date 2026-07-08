import { createContext, useContext } from 'react';
import type { Repository } from './types';

export const RepositoryContext = createContext<Repository | null>(null);

export function useRepository(): Repository {
  const ctx = useContext(RepositoryContext);
  if (!ctx) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return ctx;
}
