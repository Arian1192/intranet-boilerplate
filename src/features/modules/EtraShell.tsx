import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

const tabs = [
  { label: 'Acciones', href: '/etra/tareas' },
  { label: 'Seeding', href: '/etra/seeding' },
  { label: 'Cuentas', href: '/etra/cuentas' },
];

export function EtraShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'Comunicación & PR', href: '/etra', tabs }}>
      <Outlet />
    </AppLayout>
  );
}
