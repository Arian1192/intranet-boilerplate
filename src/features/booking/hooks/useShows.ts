import { useEffect, useState } from 'react';
import { useRepository } from '@/repositories';
import type { Show } from '@/types';

export function useShows() {
  const repository = useRepository();
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repository
      .getShows()
      .then((result) => {
        if (!cancelled) setShows(result);
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
  }, [repository]);

  return { shows, isLoading, error };
}
