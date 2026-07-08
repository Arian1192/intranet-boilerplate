import { useEffect, useState } from 'react';
import { useRepository } from '@/repositories';
import type { Artist } from '@/types';

export function useArtists() {
  const repository = useRepository();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repository
      .getArtists()
      .then((result) => {
        if (!cancelled) setArtists(result);
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

  return { artists, isLoading, error };
}
