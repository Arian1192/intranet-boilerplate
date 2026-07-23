import { AppLayout } from '@/components/layout';
import type { User } from '@/types';
import { IncidenciasPage } from '@/features/incidencias/pages/IncidenciasPage';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

export function IncidenciasShell() {
  return (
    <AppLayout user={mockUser}>
      <IncidenciasPage />
    </AppLayout>
  );
}
