import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getSeedingReport();

export function useSeedingReport() {
  return useRepositoryQuery(query);
}
