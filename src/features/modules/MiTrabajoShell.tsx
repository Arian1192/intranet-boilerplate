import { AppLayout } from '@/components/layout';
import type { User } from '@/types';
import { MiEspacioPage } from '@/features/mi-trabajo/pages/MiEspacioPage';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

export function MiTrabajoShell() {
  return (
    <AppLayout user={mockUser}>
      <MiEspacioPage usuario={mockUser.name} />
    </AppLayout>
  );
}
