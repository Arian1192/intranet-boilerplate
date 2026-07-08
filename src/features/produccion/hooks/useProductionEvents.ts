import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getProductionEvents();

export function useProductionEvents() {
  return useRepositoryQuery(query);
}
