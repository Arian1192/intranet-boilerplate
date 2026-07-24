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
  { label: 'Shows', href: '/shows' },
  { label: 'Calendario', href: '/calendario-c1' },
  { label: 'Disponibilidad', href: '/disponibilidad' },
  { label: 'Contactos', href: '/contactos' },
];

export function ConceptOneShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'Booking & Management', tabs, actionLabel: '+ Añadir show' }}>
      <Outlet />
    </AppLayout>
  );
}
