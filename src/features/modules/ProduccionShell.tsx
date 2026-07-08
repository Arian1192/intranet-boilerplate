import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

const tabs = [{ label: 'Eventos', href: '/produccion' }];

export function ProduccionShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'Producción', href: '/produccion', tabs }}>
      <Outlet />
    </AppLayout>
  );
}
