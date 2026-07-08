import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getPrActions();

export function usePrActions() {
  return useRepositoryQuery(query);
}
