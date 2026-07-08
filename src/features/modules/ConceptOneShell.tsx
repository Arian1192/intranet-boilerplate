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
  { label: 'Dashboard', href: '/conceptone' },
  { label: 'Shows', href: '/conceptone/shows' },
  { label: 'Logística', href: '/conceptone/logistica' },
  { label: 'Artistas', href: '/conceptone/artistas' },
  { label: 'Analítica', href: '/conceptone/analitica' },
];

export function ConceptOneShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'Booking & Management', tabs, actionLabel: '+ Añadir show' }}>
      <Outlet />
    </AppLayout>
  );
}
