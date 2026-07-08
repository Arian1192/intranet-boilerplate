import { useEffect, useState } from 'react';
import { useRepository } from '@/repositories';
import type { BookingDashboard } from '@/types';

export function useBookingDashboard() {
  const repository = useRepository();
  const [data, setData] = useState<BookingDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    repository
      .getBookingDashboard()
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
  }, [repository]);

  return { data, isLoading, error };
}
