import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getInventory();

export function useInventory() {
  return useRepositoryQuery(query);
}
