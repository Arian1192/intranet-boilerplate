import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

const tabs = [
  { label: 'Clientes', href: '/crm' },
  { label: 'Pipeline', href: '/crm/pipeline' },
  { label: 'Crecimiento', href: '/crm/crecimiento' },
];

export function CRMShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'CRM', href: '/crm', tabs }}>
      <Outlet />
    </AppLayout>
  );
}
