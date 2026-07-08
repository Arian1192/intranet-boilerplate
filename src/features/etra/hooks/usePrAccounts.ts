import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getPrAccounts();

export function usePrAccounts() {
  return useRepositoryQuery(query);
}
