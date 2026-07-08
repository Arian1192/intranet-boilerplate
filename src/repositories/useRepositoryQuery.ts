import { useEffect, useState } from 'react';
import { useRepository } from './RepositoryContext';
import type { Repository } from './types';

export interface RepositoryQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useRepositoryQuery<T>(
  query: (repository: Repository) => Promise<T>
): RepositoryQueryResult<T> {
  const repository = useRepository();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    query(repository)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repository, query]);

  return { data, isLoading, error };
}
