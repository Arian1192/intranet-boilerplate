import { useEffect, useState } from 'react';
import { useRepository } from '@/repositories';
import type { Dashboard } from '@/types';

export function useDashboard() {
  const repository = useRepository();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repository
      .getDashboard()
      .then((data) => {
        if (!cancelled) setDashboard(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  return { dashboard, isLoading, error };
}
