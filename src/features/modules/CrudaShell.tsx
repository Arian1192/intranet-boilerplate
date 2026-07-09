import { Outlet } from 'react-router';
import { BarChart2 } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

const tabs = [
  { label: 'Pedidos', href: '/cruda' },
  { label: 'Catálogo', href: '/cruda/catalogo' },
];

export function CrudaShell() {
  return (
    <AppLayout
      user={mockUser}
      module={{
        name: 'CRUDA',
        href: '/cruda',
        tabs,
        iconActions: [{ icon: BarChart2, href: '/cruda/analitica', label: 'Analítica' }],
      }}
    >
      <Outlet />
    </AppLayout>
  );
}
