import { AppLayout } from '@/components/layout';
import type { User } from '@/types';
import { MiTrabajoPage } from '@/features/mi-trabajo/pages/MiTrabajoPage';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

export function MiTrabajoShell() {
  return (
    <AppLayout user={mockUser}>
      <MiTrabajoPage />
    </AppLayout>
  );
}
