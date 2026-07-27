import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

export function TeamShell() {
  const tabs = [
    { label: 'Equipo', href: '/personal' },
    { label: 'Calendario', href: '/personal/calendario' },
    { label: 'Fichas', href: '/personal/fichas' },
  ];
  return (
    <AppLayout user={mockUser} module={{ name: 'Team', href: '/personal', tabs }}>
      <Outlet />
    </AppLayout>
  );
}
