import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getDeliveries();

export function useDeliveries() {
  return useRepositoryQuery(query);
}
