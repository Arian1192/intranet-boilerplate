import { RepositoryContext } from './RepositoryContext';
import type { Repository } from './types';

export interface RepositoryProviderProps {
  repository: Repository;
  children: React.ReactNode;
}

export function RepositoryProvider({ repository, children }: RepositoryProviderProps) {
  return (
    <RepositoryContext.Provider value={repository}>
      {children}
    </RepositoryContext.Provider>
  );
}
