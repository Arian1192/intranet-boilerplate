import { Outlet } from 'react-router';
import { BarChart2, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

const tabs = [
  { label: 'Resumen', href: '/euphoric' },
  { label: 'Campañas', href: '/euphoric/campanas' },
  { label: 'Contenido', href: '/euphoric/calendario' },
  { label: 'Piezas', href: '/euphoric/piezas' },
  { label: 'Eventos', href: '/euphoric/eventos' },
  { label: 'Cuentas', href: '/euphoric/cuentas' },
];

export function EuphoricShell() {
  return (
    <AppLayout
      user={mockUser}
      module={{
        name: 'Euphoric Media',
        href: '/euphoric',
        tabs,
        iconActions: [
          { icon: Users, href: '/euphoric/artistas', label: 'Artistas' },
          { icon: BarChart2, href: '/euphoric/analitica', label: 'Analítica' },
        ],
      }}
    >
      <Outlet />
    </AppLayout>
  );
}
