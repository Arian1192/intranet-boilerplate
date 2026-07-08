import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getPrDashboard();

export function usePrDashboard() {
  return useRepositoryQuery(query);
}
