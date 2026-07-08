import { AppRouter } from './router';
import { RepositoryProvider, createRepository } from '@/repositories';

const repository = createRepository(import.meta.env.VITE_DATA_ADAPTER || 'mock');

export default function App() {
  return (
    <RepositoryProvider repository={repository}>
      <AppRouter />
    </RepositoryProvider>
  );
}
