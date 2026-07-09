import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { useRepositoryQuery } from './useRepositoryQuery';
import { RepositoryContext } from './RepositoryContext';
import type { Repository } from './types';

function wrapper(repository: Partial<Repository>) {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(RepositoryContext.Provider, { value: repository as Repository }, children);
}

describe('useRepositoryQuery', () => {
  it('resolves data from the given query function', async () => {
    const query = vi.fn((repository: Repository) => repository.getPrAccounts());
    const repository: Partial<Repository> = {
      getPrAccounts: () =>
        Promise.resolve([
          {
            id: 'a1',
            name: 'Cliente A',
            status: 'active',
            manager: 'X',
            crmClient: 'X',
            contact: 'X',
            obligations: [],
            coverage: [],
            billing: { defaultRetainer: 0, defaultCommissionPct: 20, months: [] },
          },
        ]),
    };

    const { result } = renderHook(() => useRepositoryQuery(query), { wrapper: wrapper(repository) });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('captures errors from a rejected query', async () => {
    const query = vi.fn((repository: Repository) => repository.getPrAccounts());
    const repository: Partial<Repository> = {
      getPrAccounts: () => Promise.reject(new Error('boom')),
    };

    const { result } = renderHook(() => useRepositoryQuery(query), { wrapper: wrapper(repository) });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('boom');
  });
});
