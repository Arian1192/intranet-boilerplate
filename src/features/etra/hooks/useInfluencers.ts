import { useRepositoryQuery } from '@/repositories';
import type { Repository } from '@/repositories';

const query = (repository: Repository) => repository.getInfluencers();

export function useInfluencers() {
  return useRepositoryQuery(query);
}
