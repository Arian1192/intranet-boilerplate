import { useState, useCallback } from 'react';
import { useRepository } from '@/repositories';
import type { UserSession } from '@/types';

interface UseLoginResult {
  login: (email: string, password: string) => Promise<UserSession>;
  isLoading: boolean;
  error: string | null;
}

export function useLogin(): UseLoginResult {
  const repository = useRepository();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const session = await repository.login(email, password);
        return session;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [repository]
  );

  return { login, isLoading, error };
}
