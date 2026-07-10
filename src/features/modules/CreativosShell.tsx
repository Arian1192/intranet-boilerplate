import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

const tabs = [{ label: 'Piezas', href: '/creativos' }];

export function CreativosShell() {
  return (
    <AppLayout
      user={mockUser}
      module={{
        name: 'Creativos',
        href: '/creativos',
        tabs,
      }}
    >
      <Outlet />
    </AppLayout>
  );
}
